import qrcode from 'qrcode-terminal';
import { getLogger } from 'log4js';
import { colorOutput, OutputStyles, selectCampaign } from '../helpers';
import { getLocales } from '../i18n';
import settings from '../../settings.json';

const logger = getLogger('fundMothership');
const strings = getLocales(settings.locale);

const main = async (): Promise<void> => {
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
