import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import createObject from '../helpers/createObject';
import getCampaignWIFs from '../helpers/getCampaignWIFs';

import { getLocales } from '../i18n';
import selectCampaign from '../prompts/selectCampaign';
import writeCSV from './writeCSV';
import getSettings from '../getSettings';

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const main = async (): Promise<void> => {
  const logger = getLogger('createCSV');
  const settings = getSettings();
  const strings = getLocales(settings.locale);
  try {
    const campaignData = await selectCampaign();
    if (!campaignData) return;

    const wifs = getCampaignWIFs(campaignData.title);
    const addresses = await createObject(wifs);
    const filename = `${settings.outDir}/${campaignData.title}/addresses.csv`;

    logger.info(
      colorOutput({
        item: strings.CREATE_CSV.INFO_GENERATING_CSV,
        value: campaignData.title,
        style: OutputStyles.Start,
      }),
    );

    await writeCSV(filename, addresses);

    logger.info(
      colorOutput({
        item: strings.CREATE_CSV.INFO_GENERATING_CSV_COMPLETE,
        value: filename,
        style: OutputStyles.Complete,
      }),
      '\n============================================================',
    );
  } catch (error) {
    logger.debug(error.message);
    throw error;
  }
};

export default main;
