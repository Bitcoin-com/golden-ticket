import { getLogger, configure } from 'log4js';
import selectCampaign from './prompts/selectCampaign';
import loggerConfig from './helpers/loggerConfig';

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
    // user selects campaign
    const selectedCampaign = await selectCampaign();
    if (!selectedCampaign) return;
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
