import { getLogger } from 'log4js';

import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

const logFundConfirm = (txid: string): void => {
  logger.info(
    colorOutput({
      item: TITLES.FUND_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.FUND_TXID,
      value: txid,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.FUND_EXPLORER,
      value: `https://explorer.bitcoin.com/bch/tx/${txid}`,
      lineabreak: true,
    }),
  );
};

export default logFundConfirm;
