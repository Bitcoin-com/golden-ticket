import emoji from "node-emoji";
import { getLogger } from "log4js";
import { colorOutput } from "../helpers/colorFormatters";
import { WalletInfo } from "../interfaces";
import chalk from "chalk";

const logger = getLogger("printGeneratedWallet");
/**
 * Prints out wallet information
 *
 * @param {WalletInfo} { strings, data, error }
 * @returns {void}
 */
const printGeneratedWallet = ({ strings, data, error }: WalletInfo): void => {
  try {
    logger.debug("generateWallet::printGeneratedWallet");

    if (error) {
      logger.error(colorOutput(strings.ERROR, error.message));
      return;
    }

    if (!data) {
      logger.error(colorOutput(strings.ERROR, "no data. wtf?"));
      return;
    }

    const {
      filename,
      mnemonic,
      hdpath,
      title,
      mothership: { fullNodePath, address }
    } = data;

    logger.info(colorOutput(strings.INFO_CAMPAIGN, title, { highlight: true }));
    logger.info(colorOutput(strings.INFO_MNEMONIC, mnemonic));
    logger.info(colorOutput(strings.INFO_HDPATH, hdpath));
    logger.info(colorOutput(strings.INFO_HDNODE, fullNodePath));
    logger.info(colorOutput(strings.INFO_ADDRESS, address));

    logger.info(
      colorOutput(strings.INFO_WRITE_SUCCESS, filename),
      emoji.get(":white_check_mark:")
    );
  } catch (error) {
    logger.error(colorOutput(strings.ERROR, error.message));
  }
};

export default printGeneratedWallet;
