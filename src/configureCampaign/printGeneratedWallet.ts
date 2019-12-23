import { getLogger } from 'log4js';
import { colorOutput, OutputStyles, sleep } from '../helpers';
import settings from '../../settings.json';
import { locales } from '../i18n';
import { Campaign } from '../interfaces';

const logger = getLogger('printGeneratedWallet');
const strings = locales[settings.defaultLocale];

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
      mnemonic,
      hdpath,
      title,
      mothership: { fullNodePath, address },
    } = data;

    logger.info(
      colorOutput({
        item: strings.INFO_CAMPAIGN,
        value: title,
        style: OutputStyles.Highlight,
      }),
    );
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_MNEMONIC, value: mnemonic }));
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_HDPATH, value: hdpath }));
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.INFO_HDNODE, value: fullNodePath }),
    );
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_ADDRESS, value: address }));
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.INFO_WRITE_SUCCESS, value: filename }),
      '\n',
    );
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default displayCampaignInfo;
