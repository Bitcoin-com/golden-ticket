import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import settings from '../../settings.json';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers';

const createSpread = async (count: number): Promise<Spread | null> => {
  const logger = getLogger();
  const { CAMPAIGN, TITLES } = getLocales(settings.locale);

  try {
    // eslint-disable-next-line no-console
    console.clear();

    // setup the ticket spread
    let lastRange = 0;
    let lastValue = 0;
    let spread: Spread = { '0': 1 };

    while (lastRange < count) {
      // eslint-disable-next-line no-console
      console.clear();

      // show current spread status
      logger.info(
        colorOutput({
          item: TITLES.CREATE_SPREAD,
          style: OutputStyles.Title,
          lineabreak: true,
        }),
      );

      logger.info(
        colorOutput({
          item: CAMPAIGN.SPREAD_TICKETS_REMAINING,
          value: `${count - lastRange}/${count}`,
        }),
      );
      logger.info(
        colorOutput({
          item: CAMPAIGN.SPREAD_VALUE_LAST,
          value: `${lastValue}`,
        }),
      );
      logger.info(
        colorOutput({
          item: CAMPAIGN.SPREAD_TOTALS,
          value: `${Object.keys(spread).length - 1}`,
        }),
      );

      const next = readlineSync.questionInt(
        colorOutput({
          item: `${CAMPAIGN.SPREAD_RANGE} ${lastRange}`,
          value: `${lastRange + 1}-${count}`,
          style: OutputStyles.Question,
        }),
        { defaultInput: `${lastRange + 1}` },
      );

      const value = readlineSync.questionInt(
        colorOutput({
          item: `${CAMPAIGN.SPREAD_VALUE} ${lastRange}-${next}`,
          value: `${lastValue + 1}`,
          style: OutputStyles.Question,
        }),
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
