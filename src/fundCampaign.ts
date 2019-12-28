import { getLogger, configure } from 'log4js';
import qrcode from 'qrcode-terminal';
import { keyInPause } from 'readline-sync';

import loggerConfig from './helpers/loggerConfig';
import selectCampaign from './prompts/selectCampaign';
import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import getSettings from './helpers/getSettings';
import { getLocales } from './i18n';

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const fundCampaign = async (): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();
  const { TITLES, INFO, QUESTIONS } = getLocales(settings.locale);
  configure(loggerConfig);
  logger.debug('init');

  try {
    const campaignData = await selectCampaign();
    if (!campaignData) return;

    const {
      mothership: { address },
    } = campaignData;

    logger.info(
      colorOutput({
        item: TITLES.FUND_MOTHERSHIP,
        style: OutputStyles.Title,
        lineabreak: true,
      }),
    );
    qrcode.generate(address, { small: true });
    logger.info(
      colorOutput({
        item: INFO.FUND_MOTHERSHIP,
        value: `https://explorer.bitcoin.com/bch/address/${address}\n`,
      }),
    );
    keyInPause(
      colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
    );
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundCampaign();
