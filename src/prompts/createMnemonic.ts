import { Mnemonic } from 'bitbox-sdk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';

import { getLocales } from '../i18n';

import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';

import logMnemonic from '../logger/logMnemonic';

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = async (
  language: string,
  master?: Campaign,
): Promise<string | null> => {
  const logger = getLogger();
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);

  try {
    // get and show user current mnemonic
    const mnemonic = master && master.mothership.mnemonic;

    logMnemonic(mnemonic);

    // asks user if wallet should generate
    const shouldGenerate = readlineSync.keyInYN(
      colorOutput({
        item: QUESTIONS.CAMPAIGN_MNEMONIC_GENERATE,
        style: OutputStyles.Question,
      }),
    );

    // creates and returns a mnemonic
    if (shouldGenerate) {
      const bbMnemonic = new Mnemonic();
      const wordList = await bbMnemonic.wordLists()[language.toLowerCase()];
      const generated = bbMnemonic.generate(256, wordList);

      logMnemonic(generated);

      readlineSync.keyInPause(
        colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
      );
      return generated;
    }

    logMnemonic(mnemonic);

    // promps user to enter own mnemonic
    const newMnemonic = readlineSync.question(
      colorOutput({
        item: QUESTIONS.CAMPAIGN_MNEMONIC_ENTER,
        value: mnemonic,
        style: OutputStyles.Question,
      }),
      { defaultInput: mnemonic },
    );

    // this needs work... no checks in place to see if valid
    return newMnemonic;
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateMnemonic;
