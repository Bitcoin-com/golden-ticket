import { Mnemonic } from 'bitbox-sdk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import settings from '../../settings.json';

/**
 * Generates a mnemonic
 * @return {string} The wallet mnemonic string
 */
const generateMnemonic = async (
  language: string,
  master?: Campaign,
): Promise<string | null> => {
  const logger = getLogger();
  const { CAMPAIGN, TITLES } = getLocales(settings.locale as Locale);

  try {
    // prints title
    const showTitle = (): void =>
      logger.info(
        colorOutput({
          item: TITLES.CREATE_MNEMONIC,
          style: OutputStyles.Title,
          lineabreak: true,
        }),
      );
    showTitle();

    // get and show user current mnemonic
    const mnemonic = master && master.mothership.mnemonic;
    if (mnemonic) {
      logger.info(
        colorOutput({
          item: CAMPAIGN.MNEMONIC_CURRENT,
          value: mnemonic,
          lineabreak: true,
        }),
      );
    }

    // asks user if wallet should generate
    const shouldGenerate = readlineSync.keyInYN(
      colorOutput({
        item: CAMPAIGN.MNEMONIC,
        style: OutputStyles.Question,
      }),
    );

    // creates and returns a mnemonic
    if (shouldGenerate) {
      const bbMnemonic = new Mnemonic();
      const wordList = await bbMnemonic.wordLists()[language.toLowerCase()];
      const generated = bbMnemonic.generate(256, wordList);

      logger.info(
        colorOutput({
          item: 'Mnemonic generated',
          value: generated,
          style: OutputStyles.Information,
        }),
      );
      readlineSync.keyInPause();
      return generated;
    }

    const newMnemonic = readlineSync.question(
      colorOutput({
        item: CAMPAIGN.MNEMONIC_ENTER,
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
