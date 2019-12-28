import { getLogger, configure } from 'log4js';
import selectCampaign from './prompts/selectCampaign';
import loggerConfig from './helpers/loggerConfig';
import createCampaign from './prompts/createCampaign';

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const init = async (): Promise<void> => {
  const logger = getLogger();
  configure(loggerConfig);
  logger.debug('init');

  try {
    // user selects campaign
    const campaignData = await selectCampaign();
    if (!campaignData) return;

    await createCampaign(campaignData);
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
