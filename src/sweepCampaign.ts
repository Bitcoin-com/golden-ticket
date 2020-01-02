import fs from 'fs-extra';
import { getLogger, configure } from 'log4js';
import { keyInYNStrict, question, keyIn } from 'readline-sync';
import { json2csvAsync } from 'json-2-csv';
import { RawTransactions } from 'bitbox-sdk';

import selectCampaign from './prompts/selectCampaign';

import loggerConfig from './helpers/loggerConfig';
import getTicketStats from './helpers/getTicketStats';
import getUTXOs from './helpers/getUTXOs';
import getSettings from './helpers/getSettings';

import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import { getLocales } from './i18n';
import logSweep from './logger/logSweep';
import getSweepTransaction from './helpers/getSweepTransaction';
import logFundConfirm from './logger/logFundConfirm';

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);
  configure(loggerConfig);

  try {
    // user selects campaign
    const campaign = await selectCampaign();
    if (!campaign) return;

    const campaignDir = `${settings.outDir}/${campaign.title}/`;
    const csvPath = `${campaignDir}campaign.csv`;
    const jsonPath = `${campaignDir}campaign.json`;

    const ticketStats = getTicketStats(campaign.title);
    const addresses = ticketStats.map(t => t.cashAddress);

    const utxosResult = await getUTXOs(addresses);
    if (!Array.isArray(utxosResult)) return;

    const stats = [];
    for (let i = 0; i < utxosResult.length; i++) {
      const utxo = utxosResult[i];
      const { wif, cashAddress } = ticketStats[i];
      const claimed = utxo.utxos.length === 0;
      const value = utxo.utxos.reduce((p, c) => p + c.satoshis, 0);
      const obj: CSV = { cashAddress, wif, claimed, value };
      stats.push(obj);
    }

    const csv = await json2csvAsync(stats);

    fs.writeFileSync(csvPath, csv);
    fs.writeFileSync(jsonPath, JSON.stringify(stats));

    logSweep(campaign.title, stats);

    // ask user for bch or slp address
    const slp = keyIn(
      colorOutput({
        item: QUESTIONS.FUND_ADDRESS_TYPE,
        value: 'b/t',
        style: OutputStyles.Question,
      }),
      { defaultInput: 'b' },
    );
    if (slp === 't') return;

    logSweep(campaign.title, stats);

    // ask user for address
    const address = question(
      colorOutput({
        item: 'Enter destination BCH address',
        style: OutputStyles.Question,
      }),
    );

    const combinedResults = utxosResult.reduce((prev, curr) => {
      const ticket = ticketStats.find(t => t.cashAddress === curr.cashAddress);
      if (!ticket) return prev;

      return [
        ...prev,
        ...curr.utxos.reduce((p, c) => [...p, { ...c, wif: ticket.wif }], []),
      ];
    }, []);

    const transaction = await getSweepTransaction(combinedResults, address);

    logSweep(campaign.title, stats);
    const send = keyInYNStrict(
      colorOutput({
        item: 'transaction built, confirm send',
        style: OutputStyles.Question,
      }),
    );
    if (!send) return;

    // send transaction
    const bbRawTransaction = new RawTransactions();
    const tx = await transaction.build();
    const txid: string = await bbRawTransaction.sendRawTransaction(
      await tx.toHex(),
    );

    logFundConfirm(txid);
  } catch (error) {
    throw logger.error(error);
  }
};

export default init;
