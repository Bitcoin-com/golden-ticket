import { Mnemonic } from "bitbox-sdk";
import settings from "../../settings.json";

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = (): string => {
  const mnemonic = new Mnemonic();
  const language = settings.languages[settings.defaultLocale];
  const wordList = mnemonic.wordLists()[language.toLowerCase()]; // get word list for the selected language
  return mnemonic.generate(256, wordList);
};

export default generateMnemonic;
