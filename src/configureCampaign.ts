import { getLogger, configure } from 'log4js';
import { keyInPause } from 'readline-sync';
import selectCampaign from './prompts/selectCampaign';
import loggerConfig from './helpers/loggerConfig';
import createCampaign from './prompts/createCampaign';
import './registerFiles';
/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  const logger = getLogger();
  configure(loggerConfig);

  try {
    // user selects campaign
    const campaignData = await selectCampaign();
    if (!campaignData) return;
    // take user through campaign configuration
    await createCampaign(campaignData);
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
