import { getLogger } from 'log4js';
import {
  colorOutput,
  OutputStyles,
  createObject,
  getCampaignWIFs,
} from '../helpers';
import selectCampaign from '../helpers/prompts/selectCampaign';
import writeCSV from './writeCSV';
import settings from '../../settings.json';
import { getLocales } from '../i18n';

const logger = getLogger('createCSV');
const strings = getLocales(settings.locale);

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const main = async (): Promise<void> => {
  try {
    const campaignData = await selectCampaign();
    if (!campaignData) return;

    const wifs = await getCampaignWIFs(campaignData.title);
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
