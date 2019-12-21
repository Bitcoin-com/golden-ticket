import { Mnemonic } from "bitbox-sdk/lib/Mnemonic";

/**
 * Generates a mnemonic
 * @param {string} [language=english] Language for mnemonic generation
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = (language: string = "english"): string => {
  const mnemonic = new Mnemonic();
  const wordList = mnemonic.wordLists()[language.toLowerCase()]; // get word list for the selected language
  return mnemonic.generate(256, wordList);
};

export default generateMnemonic;
