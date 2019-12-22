import qrcode from "qrcode-terminal";
import {
  getLogger,
  colorOutput,
  generateConfig,
  promptCampaign,
  OutputStyles
} from "../helpers";

const main: any = async (): Promise<any> => {
  try {
    const logger = getLogger("fundMothership");
    const { strings } = generateConfig("FUND_MOTHERSHIP");
    const {
      mothership: { address }
    } = await promptCampaign(strings.SELECT_CAMPAIGN);

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
