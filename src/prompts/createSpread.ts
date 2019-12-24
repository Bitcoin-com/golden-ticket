import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import settings from '../../settings.json';
import { getLocales } from '../i18n';
import { colorQuestion, colorOutput } from '../helpers';

const createSpread = async (count: number): Promise<Spread | null> => {
  const logger = getLogger();
  const { CAMPAIGN } = getLocales(settings.locale);

  try {
    // eslint-disable-next-line no-console
    console.clear();

    // setup the ticket spread
    let lastRange = 0;
    let lastValue = 0;
    let spread: Spread = { '0': 1 };

    while (lastRange < count) {
      // show current spread status

      logger.debug('createSpread', count, lastRange, lastValue, spread);
      logger.info(
        colorOutput({
          item: 'Remaining tickets',
          value: `${count - lastRange}/${count}`,
        }),
      );
      logger.info(
        colorOutput({
          item: 'Last spread value',
          value: `${lastValue}`,
        }),
      );

      logger.info(
        colorOutput({
          item: CAMPAIGN.SPREAD_COUNT,
          value: `${Object.keys(spread).length - 1}`,
        }),
      );

      const next = readlineSync.questionInt(
        colorQuestion(
          `${CAMPAIGN.SPREAD_RANGE} ${lastRange}`,
          `${lastRange + 1}-${count}`,
        ),
        { defaultInput: `${lastRange + 1}` },
      );

      const value = readlineSync.questionInt(
        colorQuestion(
          `${CAMPAIGN.SPREAD_VALUE} ${lastRange}-${next}`,
          `${lastValue + 1}`,
        ),
        {
          defaultInput: `${lastValue + 1}`,
        },
      );
      spread = { ...spread, [`${lastRange}`]: value };
      lastRange = next;
      lastValue = value;
    }

    return spread;
  } catch (error) {
    throw logger.error(error);
  }
};

export default createSpread;
