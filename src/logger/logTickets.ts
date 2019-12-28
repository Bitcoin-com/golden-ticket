import { getLogger } from 'log4js';

import getSettings from '../helpers/getSettings';

import { getLocales } from '../i18n';

import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logTickets = (ticketCount?: number): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { locale, tickets } = settings;
  const { QUESTIONS, TITLES, LIMITS, INFO } = getLocales(locale);

  // prints title
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  if (ticketCount)
    logger.info(
      colorOutput({
        item: INFO.CAMPAIGN_TICKETS_COUNT_CURRENT,
        value: ticketCount.toString(),
        lineabreak: true,
      }),
    );
};

export default logTickets;
