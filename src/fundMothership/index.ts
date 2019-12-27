import { getLogger } from 'log4js';
import qrcode from 'qrcode-terminal';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import selectCampaign from '../prompts/selectCampaign';
import { getLocales } from '../i18n';
import getSettings from '../getSettings';

const main = async (): Promise<void> => {
  const logger = getLogger('fundMothership');
  const settings = getSettings();
  const strings = getLocales(settings.locale);
  try {
    const campaignData = await selectCampaign();
    if (!campaignData) return;
    const {
      mothership: { address },
    } = campaignData;

    logger.info(
      colorOutput({
        item: strings.FUND_MOTHERSHIP.INFO_SEND_TO_MOTHERSHIP,
        value: address,
        style: OutputStyles.Waiting,
      }),
    );
    qrcode.generate(address, { small: true });
    logger.info(
      colorOutput({
        item: strings.FUND_MOTHERSHIP.INFO_CHECK_MOTHERSHIP,
        value: `https://explorer.bitcoin.com/bch/address/${address}`,
        style: OutputStyles.Information,
      }),
    );
    logger.info('============================================================');
  } catch (error) {
    logger.debug(error.message);
    throw error;
  }
};

export default main;
