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
      logger.error(colorOutput({ item: strings.ERROR, value: error.message }));
      return;
    }

    if (!data) {
      logger.error(
        colorOutput({ item: strings.ERROR, value: "no data. wtf?" })
      );
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
      colorOutput({
        item: strings.INFO_CAMPAIGN,
        value: title,
        style: OutputStyles.Highlight
      })
    );
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_MNEMONIC, value: mnemonic }));
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_HDPATH, value: hdpath }));
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.INFO_HDNODE, value: fullNodePath })
    );
    await sleep(settings.timer);
    logger.info(colorOutput({ item: strings.INFO_ADDRESS, value: address }));
    await sleep(settings.timer);
    logger.info(
      colorOutput({ item: strings.INFO_WRITE_SUCCESS, value: filename }),
      "\n"
    );
  } catch (error) {
    logger.error(colorOutput({ item: strings.ERROR, value: error.message }));
  }
};

export default printGeneratedWallet;
