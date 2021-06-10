import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const displayFundType = (): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { TITLES, INFO } = getLocales(settings.locale);

  logger.info(
    colorOutput({
      item: TITLES.FUND_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.FUND_ADDRESS_TYPE,
      style: OutputStyles.Information,
      lineabreak: true,
    }),
  );
};

export default displayFundType;
