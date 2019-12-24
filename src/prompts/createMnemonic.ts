import { Mnemonic } from 'bitbox-sdk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { getLocales } from '../i18n';
import { colorQuestion } from '../helpers/colorFormatters';
import settings from '../../settings.json';

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = async (language: string): Promise<string | null> => {
  const logger = getLogger();
  const { CAMPAIGN } = getLocales(settings.locale as Locale);

  try {
    // eslint-disable-next-line no-console
    console.clear();
    const create = readlineSync.keyInYN(
      colorQuestion(CAMPAIGN.MNEMONIC, CAMPAIGN.MNEMONIC_DEFAULT),
      {
        defaultInput: 'y',
      },
    );

    if (create) {
      const mnemonic = new Mnemonic();
      const wordList = await mnemonic.wordLists()[language.toLowerCase()];
      const generated = mnemonic.generate(256, wordList);
      return generated;
    }

    return readlineSync.question(CAMPAIGN.MNEMONIC_ENTER) || null;
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateMnemonic;
