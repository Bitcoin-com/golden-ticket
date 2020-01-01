import fs from 'fs-extra';
import { getLogger, configure } from 'log4js';
import { keyInPause } from 'readline-sync';
import { json2csvAsync } from 'json-2-csv';

import selectCampaign from './prompts/selectCampaign';

import loggerConfig from './helpers/loggerConfig';
import getTicketStats from './helpers/getTicketStats';
import getUTXOs from './helpers/getUTXOs';
import getSettings from './helpers/getSettings';
import logCampaignStats from './logger/logCampaignStats';
import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import { getLocales } from './i18n';

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

    const utxos = await getUTXOs(addresses);
    if (!Array.isArray(utxos)) return;

    const stats = [];
    for (let i = 0; i < utxos.length; i++) {
      const utxo = utxos[i];
      const { wif, cashAddress } = ticketStats[i];
      const claimed = utxo.utxos.length === 0;
      const value = utxo.utxos.reduce((p, c) => p + c.satoshis, 0);
      const obj: CSV = { cashAddress, wif, claimed, value };
      stats.push(obj);
    }

    const csv = await json2csvAsync(stats);

    fs.writeFileSync(csvPath, csv);
    fs.writeFileSync(jsonPath, JSON.stringify(stats));

    logCampaignStats(campaign.title, stats);

    keyInPause(
      colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
    );
  } catch (error) {
    throw logger.error(error);
  }
};

export default init;
