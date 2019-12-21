import { Mnemonic } from "bitbox-sdk/lib/Mnemonic";
import settings from "../settings.json";
import { getLogger } from "log4js";

const logger = getLogger("generateMnemonic");
/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = (): string => {
  logger.debug("generateWallet::generateMnemonic");
  const mnemonic = new Mnemonic();
  const language = settings.languages[settings.defaultLocale];
  const wordList = mnemonic.wordLists()[language.toLowerCase()]; // get word list for the selected language
  return mnemonic.generate(256, wordList);
};

export default generateMnemonic;
