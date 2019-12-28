import { getLogger, configure } from 'log4js';
import readlineSync, { keyIn } from 'readline-sync';
import { RawTransactions } from 'bitbox-sdk';

import loggerConfig from './helpers/loggerConfig';
import selectCampaign from './prompts/selectCampaign';
import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import getSettings from './helpers/getSettings';
import { getLocales } from './i18n';
import getTicketDistribution from './helpers/getTicketDistribution';
import getTransactionHex from './helpers/getTransactionHex';

import selectUTXOs from './prompts/selectUTXOs';

import logFundType from './logger/logFundType';
import confirmFundTickets from './prompts/confirmFundTickets';
import logFundConfirm from './logger/logFundConfirm';

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const fundCampaign = async (): Promise<void> => {
  const logger = getLogger();
  configure(loggerConfig);
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);

  const bbRawTransaction = new RawTransactions();

  try {
    // get campaign to use
    const campaign = await selectCampaign();
    if (!campaign) return;
    const {
      mothership: { address, wif },
    } = campaign;

    logFundType();

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

    // get utxos set
    const utxos = await selectUTXOs(address);
    if (!utxos) return;

    // get ticket distribution and adjustment value
    const { adjustment, distribution } = getTicketDistribution({
      utxos,
      campaign,
    });

    // get user confirmation
    const confirmFund = confirmFundTickets({ adjustment, utxos, campaign });
    if (!confirmFund) return;

    // build the transaction
    const txhex = await getTransactionHex(utxos, wif, distribution);

    // send transaction
    const txid: string = await bbRawTransaction.sendRawTransaction(txhex);

    // log confirmation
    logFundConfirm(txid);
    readlineSync.keyInPause(
      colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
    );
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundCampaign();
