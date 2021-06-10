import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import formatSpread from '../helpers/formatSpread';

/**
 * Show spread information
 *
 * @param {{
 *   count: number;
 *   spread: { [any: string]: number };
 *   lastRange?: number;
 * }} props
 */
const logSpread = (props: {
  count: number;
  spread: { [any: string]: number };
  range?: number;
}): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { INFO, TITLES } = getLocales(settings.locale);

  // show current spread status
  const { count, range = 0, spread } = props;
  const totals = Object.keys(spread).length;

  // the title
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_SPREAD,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  // remaining tickets
  if (count !== range)
    logger.info(
      colorOutput({
        item: INFO.CAMPAIGN_SPREAD_TICKETS,
        value: `${count - range}/${count}`,
      }),
    );

  // total spreads
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_SPREAD_TOTALS,
      value: `${totals}\n`,
    }),
  );

  formatSpread(spread, range).forEach(element => {
    logger.info(colorOutput({ ...element, style: OutputStyles.Information }));
  });

  logger.info('\n');
};

export default logSpread;
