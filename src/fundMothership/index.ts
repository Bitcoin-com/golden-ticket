import qrcode from "qrcode-terminal";
import {
  getLogger,
  colorOutput,
  promptCampaign,
  OutputStyles
} from "../helpers";
import { locales } from "../i18n";
import settings from "../settings.json";

const main: any = async (): Promise<any> => {
  try {
    const logger = getLogger("fundMothership");
    const strings = locales[settings.defaultLocale];

    const campaignData = await promptCampaign();
    if (campaignData === "CANCELED") return;

    const {
      mothership: { address }
    } = campaignData;

    logger.info(
      colorOutput({
        item: strings.INFO_SEND_TO_MOTHERSHIP,
        value: address,
        style: OutputStyles.Waiting
      })
    );
    qrcode.generate(address, { small: true });
    logger.info(
      colorOutput({
        item: strings.INFO_CHECK_MOTHERSHIP,
        value: `https://explorer.bitcoin.com/bch/address/${address}`,
        style: OutputStyles.Information
      })
    );
    logger.info("============================================================");
  } catch (error) {
    return error;
  }
};

export default main();
