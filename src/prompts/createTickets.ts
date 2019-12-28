import chalk from 'chalk';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import createSpread from './createSpread';
import { getLocales } from '../i18n';
import getSettings from '../helpers/getSettings';

import logTickets from '../logger/logTickets';

/**
 * Takes user through ticket configuration
 *
 * @returns {(Promise<Tickets | null>)}
 */
const createTickets = (master?: Campaign): Tickets | null => {
  const logger = getLogger();
  const settings = getSettings();
  const { locale, tickets } = settings;
  const { QUESTIONS, LIMITS } = getLocales(locale);

  try {
    logTickets(master && master.tickets.count);

    // get total number of tickets
    const count: number = readlineSync.questionInt(
      colorOutput({
        item: QUESTIONS.CAMPAIGN_TICKETS,
        value: tickets.toString(),
        style: OutputStyles.Question,
      }),
      {
        defaultInput: tickets.toString(),
        limit: '^[0-9]{1,5}$',
        limitMessage: chalk.red(LIMITS.CAMPAIGN_TICKETS),
      },
    );

    if (count === 0) return null;

    const spread = createSpread(count);
    if (!spread) return null;

    return {
      count,
      spread,
    };
  } catch (error) {
    throw logger.error(error);
  }
};

export default createTickets;
