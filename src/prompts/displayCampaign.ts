import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import sleep from '../helpers/sleep';
import { getLocales } from '../i18n';
import getSettings from '../getSettings';

/**
 * Prints out campaign information
 *
 * @param {{
 *   data: Campaign;
 *   filename: string;
 * }} {
 *   data,
 *   filename,
 * }
 * @returns {Promise<void>}
 */
const displayCampaign = async (campaign: Campaign): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();
  const strings = getLocales(settings.locale);
  logger.debug('displayCampaign()');
  try {
    const {
      title,
      mothership: { fullNodePath, address, mnemonic, hdpath },
    } = campaign;

    logger.info(
      colorOutput({
        item: strings.CAMPAIGN.INFO_CAMPAIGN,
        value: title,
        style: OutputStyles.Highlight,
      }),
    );
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.CAMPAIGN.INFO_MNEMONIC, value: mnemonic }),
    );
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.CAMPAIGN.INFO_HDPATH, value: hdpath }),
    );
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.CAMPAIGN.INFO_HDNODE, value: fullNodePath }),
    );
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.CAMPAIGN.INFO_ADDRESS, value: address }),
    );
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default displayCampaign;
