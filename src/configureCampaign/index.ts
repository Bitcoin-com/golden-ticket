import { getLogger, configure } from 'log4js';
import readlineSync from 'readline-sync';
import selectCampaign from '../prompts/selectCampaign';
import loggerConfig from '../helpers/loggerConfig';
import createCampaign from '../prompts/createCampaign';
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

    /*     // confirm overwrite
    if (!readlineSync.keyInYNStrict('overwrite?')) return;

    // go through new campaign wizard with selected campaign
    const campaign = await createCampaign(selectedCampaign);
    if (!campaign) return; */
    logger.info('selected campaign', selectCampaign);
  } catch (error) {
    throw logger.error(error);
  }
};

export default init();
