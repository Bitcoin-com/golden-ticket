import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { colorQuestion } from '../helpers/colorFormatters';
import { getLocales } from '../i18n';
import settings from '../../settings.json';
import createSpread from './createSpread';

/**
 * Takes user through ticket configuration
 *
 * @returns {(Promise<Tickets | null>)}
 */
const createTickets = async (): Promise<Tickets | null> => {
  const logger = getLogger();
  const { locale, tickets } = settings;
  const { CAMPAIGN } = getLocales(locale as Locale);
  logger.debug('createTickets');

  try {
    // eslint-disable-next-line no-console
    console.clear();
    // get total number of tickets
    const count: number = readlineSync.questionInt(
      colorQuestion(CAMPAIGN.TICKETS_NUMBER, tickets.toString()),
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

    readlineSync.keyInPause();
    return {
      count,
      spread,
    };
  } catch (error) {
    throw logger.error(error);
  }
};

export default createTickets;
