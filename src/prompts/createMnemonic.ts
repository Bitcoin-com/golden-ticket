import { Mnemonic } from 'bitbox-sdk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { getLocales } from '../i18n';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import getSettings from '../getSettings';

const logger = getLogger();
const settings = getSettings();
const { INFO, TITLES, QUESTIONS } = getLocales(settings.locale);

// prints title
const showTitle = (value?: string): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_MNEMONIC,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );
  if (value)
    logger.info(
      colorOutput({
        item: INFO.CAMPAIGN_MNEMONIC_CURRENT,
        value,
        lineabreak: true,
      }),
    );
};

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = async (
  language: string,
  master?: Campaign,
): Promise<string | null> => {
  try {
    // get and show user current mnemonic
    const mnemonic = master && master.mothership.mnemonic;

    showTitle(mnemonic);

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

      showTitle(generated);

      readlineSync.keyInPause(
        colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
      );
      return generated;
    }

    showTitle(mnemonic);

    const newMnemonic = readlineSync.question(
      colorOutput({
        item: QUESTIONS.CAMPAIGN_MNEMONIC_ENTER,
        value: mnemonic,
        style: OutputStyles.Question,
      }),
      { defaultInput: mnemonic },
    );
    // this needs work
    return newMnemonic;
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateMnemonic;
