import { Mnemonic } from 'bitbox-sdk';
import { getLogger } from 'log4js';

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = async (language: string): Promise<string> => {
  const logger = getLogger();
  try {
    const mnemonic = new Mnemonic();
    const wordList = await mnemonic.wordLists()[language.toLowerCase()]; // get word list for the selected language
    const generated = mnemonic.generate(256, wordList);
    return generated;
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateMnemonic;
