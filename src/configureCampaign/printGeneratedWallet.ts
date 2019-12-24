import { getLogger } from 'log4js';
import { colorOutput, OutputStyles, sleep } from '../helpers';
import settings from '../../settings.json';
import { getLocales } from '../i18n';

const logger = getLogger('printGeneratedWallet');
const strings = getLocales(settings.locale);

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
const displayCampaignInfo = async ({
  data,
  filename,
}: {
  data: Campaign;
  filename: string;
}): Promise<void> => {
  try {
    logger.debug('generateWallet:printGeneratedWallet()');

    const {
      title,
      mothership: { fullNodePath, address, mnemonic, hdpath },
    } = data;

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
    await sleep(settings.timer);
    logger.info(
      colorOutput({
        item: strings.CAMPAIGN.INFO_WRITE_SUCCESS,
        value: filename,
      }),
      '\n',
    );
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default displayCampaignInfo;
