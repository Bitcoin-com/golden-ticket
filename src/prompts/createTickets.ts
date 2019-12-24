import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import { getLocales } from '../i18n';
import settings from '../../settings.json';
import createSpread from './createSpread';

/**
 * Takes user through ticket configuration
 *
 * @returns {(Promise<Tickets | null>)}
 */
const createTickets = async (master?: Campaign): Promise<Tickets | null> => {
  const logger = getLogger();
  const { locale, tickets } = settings;
  const { CAMPAIGN, TITLES } = getLocales(locale as Locale);
  logger.debug('createTickets');
  logger.debug(master);
  try {
    // prints title
    logger.info(
      colorOutput({
        item: TITLES.CREATE_TICKETS,
        style: OutputStyles.Title,
        lineabreak: true,
      }),
    );

    // get total number of tickets
    const count: number = readlineSync.questionInt(
      colorOutput({
        item: CAMPAIGN.TICKETS_NUMBER,
        value: tickets.toString(),
        style: OutputStyles.Question,
      }),
      {
        defaultInput: tickets.toString(),
        limit: '^[0-9]{1,5}$',
        limitMessage: chalk.red(CAMPAIGN.TICKET_LIMIT),
      },
    );

    if (count === 0) return null;

    const spread = await createSpread(count);
    if (!spread) return null;

    logger.info("Here's the spread", spread);

    readlineSync.keyInPause('Hope you like it');
    return {
      count,
      spread,
    };
  } catch (error) {
    throw logger.error(error);
  }
};

export default createTickets;
