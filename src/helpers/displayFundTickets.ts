import { getLogger } from 'log4js';
import getSettings from './getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from './colorFormatters';
import formatSpread from './formatSpread';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const displayFundTickets = (
  funds: string,
  { tickets }: Campaign,
  adjustment?: number,
): void => {
  // title banner
  logger.info(
    colorOutput({
      item: TITLES.FUND_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // available funds
  logger.info(
    colorOutput({
      item: INFO.FUND_ADDRESS_FUNDS,
      value: funds,
    }),
  );

  logger.info('--- Tickets ---');
  // ticket count
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_TICKETS_COUNT,
      value: tickets.count,
    }),
  );
  logger.info(colorOutput({ item: INFO.CAMPAIGN_TICKETS_SPREAD }));
  formatSpread(tickets.spread, tickets.count, adjustment).forEach(el =>
    logger.info(colorOutput({ ...el, style: OutputStyles.Information })),
  );

  logger.info('\n');
};

export default displayFundTickets;
