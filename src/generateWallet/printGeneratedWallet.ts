import emoji from "node-emoji";
import logger, { colorOutput } from "../helpers/logger";
import { WalletInfo } from "../interfaces";

/**
 * Prints out wallet information
 *
 * @param {WalletInfo} { strings, data, error }
 * @returns {void}
 */
const printGeneratedWallet = ({ strings, data, error }: WalletInfo): void => {
  try {
    if (error) {
      logger.error(colorOutput(strings.ERROR, error.message));
      return;
    }

    if (!data) {
      logger.error(colorOutput(strings.ERROR, "no data. wtf?"));
      return;
    }

    logger.debug("printGeneratedWallet");

    const {
      filename,
      mnemonic,
      hdpath,
      mothership: { fullNodePath, address }
    } = data;

    logger.info(
      colorOutput(strings.INFO_MNEMONIC, mnemonic, { highlight: true })
    );
    logger.info(colorOutput(strings.INFO_HDPATH, hdpath));
    logger.info(colorOutput(strings.INFO_HDNODE, fullNodePath));
    logger.info(colorOutput(strings.INFO_ADDRESS, address));

    logger.info(
      colorOutput(strings.INFO_WRITE_SUCCESS, filename, {
        emoji: emoji.get(":rocket:")
      })
    );

    logger.info(strings.INFO_DONE, emoji.get(":white_check_mark:"));
  } catch (error) {
    logger.error(colorOutput(strings.ERROR, error.message));
  }
};

export default printGeneratedWallet;
