import emoji from "node-emoji";
import { SectionStrings } from "../i18n";
import logger, { colorOutput } from "../helpers/logger";

interface WalletInfo {
  strings: SectionStrings;
  error?: Error;
  data?: {
    filename: string;
    mnemonic: string;
    hdpath: string;
    mothership: {
      fullNodePath: string;
      address: string;
    };
  };
}

const printGeneratedWallet = ({ strings, data, error }: WalletInfo): void => {
  try {
    if (error) {
      logger.error(colorOutput(strings.ERROR, error.message));
      return;
    }

    if (!data) return;

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
  } catch (error) {}
};

export default printGeneratedWallet;
