import { Wallet, Campaign } from "../interfaces";
import {
  getLogger,
  colorOutput,
  generateConfig,
  promptCampaign,
  OutputStyles
} from "../helpers";

// consts
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import emoji from "node-emoji";

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
  } catch (error) {
    return error;
  }
};
/* try {
  const logger = getLogger("fundMothership");

  // show funder address qr code
  console.log(`Send funds to: ${wallet.mothership.address}`);
  qrcode.generate(wallet.mothership.address);
  console.log(
    `Check your mothership address on the explorer: https://explorer.bitcoin.com/bch/address/${wallet.mothership.address}`
  );
} catch (err) {
  console.log(
    `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
  );
  process.exit(0);
}
console.log(chalk.green("All done."), emoji.get(":white_check_mark:"));
 */

export default main();
