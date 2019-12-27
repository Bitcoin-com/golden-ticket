import chalk from 'chalk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import createSpread from './createSpread';
import { getLocales } from '../i18n';
import getSettings from '../getSettings';

/**
 * Takes user through ticket configuration
 *
 * @returns {(Promise<Tickets | null>)}
 */
const createTickets = (master?: Campaign): Tickets | null => {
  const logger = getLogger();
  const settings = getSettings();
  const { locale, tickets } = settings;
  const { CAMPAIGN, TITLES } = getLocales(locale);
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

    const spread = createSpread(count);
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
