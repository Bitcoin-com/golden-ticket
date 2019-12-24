import { getLogger, configure } from 'log4js';
import writeFile from './writeFile';
import settings from '../../settings.json';
import selectCampaign from '../helpers/prompts/selectCampaign';
import loggerConfig from '../helpers/loggerConfig';

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  const logger = getLogger('configureCampaign');
  configure(loggerConfig);
  logger.debug('init');

  try {
    // get input from user
    const campaignData = await selectCampaign();

    if (!campaignData) return;

    // prepare for writting wallet to file
    const filename = `${settings.outDir}/${campaignData.title}/wallet.json`;

    // write file and print results
    await writeFile(filename, campaignData);
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
