import { getLogger } from 'log4js';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

const logTransaction = ({
  utxo,
  ticket,
  sign,
}: {
  utxo?: Utxo;
  ticket?: CSV;
  sign?: boolean;
}): void => {
  const logger = getLogger();
  const settings = getSettings();
  const { TITLES } = getLocales(settings.locale);
  logger.info(
    colorOutput({
      item: TITLES.FUND_TICKETS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );
  if (utxo && !ticket) {
    logger.info(colorOutput({ item: 'Adding Inputs' }));
    logger.info(colorOutput({ item: utxo.txid, value: utxo.satoshis }));
  }

  if (!utxo && ticket) {
    logger.info(colorOutput({ item: 'Adding Outputs' }));
    logger.info(colorOutput({ item: ticket.cashAddress, value: ticket.value }));
  }

  if (utxo && sign) {
    logger.info(colorOutput({ item: 'Signing Inputs', value: utxo.txid }));
  }

  logger.info('\n');
};

export default logTransaction;
