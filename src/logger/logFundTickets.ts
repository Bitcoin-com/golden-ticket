import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import formatSpread from '../helpers/formatSpread';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const displayFundTickets = ({
  tickets,
  title,
  funds,
  adjustment,
}: {
  title: string;
  funds: string;
  adjustment: number;
  tickets: Tickets;
}): void => {
  // title banner
  logger.info(
    colorOutput({
      item: TITLES.FUND_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // campaign title
  logger.info(colorOutput({ item: INFO.CAMPAIGN_TITLE, value: title }));

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
