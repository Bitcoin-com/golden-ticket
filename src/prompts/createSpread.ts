import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import { getLocales } from '../i18n';
import getSettings from '../helpers/getSettings';

import logSpread from '../logger/logSpread';

const logger = getLogger();
const settings = getSettings();
const { QUESTIONS } = getLocales(settings.locale);

const createSpread = (count: number): Spread | null => {
  try {
    // setup the ticket spread
    let lastRange = 0;
    let lastValue = 0;
    let spread: Spread = { 0: 1 };

    while (lastRange < count) {
      // display info
      logSpread({
        count,
        range: lastRange,
        spread,
      });

      // get spread value from user
      const value = readlineSync.questionInt(
        colorOutput({
          item: `${QUESTIONS.CAMPAIGN_SPREAD_VALUE} >${lastValue + 1}`,
          value: `${lastValue + 1}`,
          style: OutputStyles.Question,
        }),
        {
          defaultInput: `${lastValue + 1}`,
        },
      );

      // update spread
      spread = { ...spread, [`${lastRange}`]: value };

      // display info
      logSpread({
        count,
        range: lastRange,
        spread,
      });

      // get next range value from user
      const next = readlineSync.questionInt(
        colorOutput({
          item: `${QUESTIONS.CAMPAIGN_SPREAD_RANGE} ${lastRange}`,
          value: `${lastRange + 1}-${count}`,
          style: OutputStyles.Question,
        }),
        { defaultInput: `${lastRange + 1}` },
      );

      // update external values
      lastRange = next;
      lastValue = value;
    }

    // display info
    logSpread({
      count,
      range: lastRange,
      spread,
    });

    // pause to show results
    readlineSync.keyInPause(
      colorOutput({
        item: QUESTIONS.SPREAD_SUMMARY,
        style: OutputStyles.Question,
      }),
    );

    return spread;
  } catch (error) {
    throw logger.error(error);
  }
};

export default createSpread;
