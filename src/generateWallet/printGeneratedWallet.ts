import { getLogger, colorOutput, OutputStyles, sleep } from "../helpers";
import { WalletInfo } from "../interfaces";
import settings from "../settings.json";

const logger = getLogger("printGeneratedWallet");
/**
 * Prints out wallet information
 *
 * @param {WalletInfo} { strings, data, error }
 * @returns {void}
 */
const printGeneratedWallet = async ({
  strings,
  data,
  error
}: WalletInfo): Promise<void> => {
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

    logger.info(
      colorOutput(strings.INFO_CAMPAIGN, title, OutputStyles.Highlight)
    );
    await sleep(settings.timer);
    logger.info(colorOutput(strings.INFO_MNEMONIC, mnemonic));
    await sleep(settings.timer);
    logger.info(colorOutput(strings.INFO_HDPATH, hdpath));
    await sleep(settings.timer);
    logger.info(colorOutput(strings.INFO_HDNODE, fullNodePath));
    await sleep(settings.timer);
    logger.info(colorOutput(strings.INFO_ADDRESS, address));
    await sleep(settings.timer);
    logger.info(colorOutput(strings.INFO_WRITE_SUCCESS, filename), "\n");
  } catch (error) {
    logger.error(colorOutput(strings.ERROR, error.message));
  }
};

export default printGeneratedWallet;
