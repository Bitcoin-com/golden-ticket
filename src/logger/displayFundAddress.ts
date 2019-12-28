import { getLogger } from 'log4js';
import qrcode from 'qrcode-terminal';
import { BitcoinCash } from 'bitbox-sdk';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO } = getLocales(settings.locale);

/**
 * Prints fund address qr
 *
 * @param {string} address
 */
const displayFundAddress = (
  address: string,
  utxos?: AddressUtxoResult | AddressUtxoResult[],
): void => {
  const bitcoinCash = new BitcoinCash();

  logger.info(
    colorOutput({
      item: TITLES.FUND_MOTHERSHIP,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  qrcode.generate(address, { small: true });
  logger.info(
    colorOutput({
      item: INFO.FUND_ADDRESS,
      value: address,
    }),
  );
  logger.info(
    colorOutput({
      item: INFO.FUND_EXPLORER,
      value: `https://explorer.bitcoin.com/bch/address/${address}`,
    }),
  );

  const value =
    utxos && !Array.isArray(utxos) && utxos.utxos[0]
      ? utxos.utxos.reduce(
          (p: number, c: { satoshis: number }) => p + c.satoshis,
          0,
        )
      : 0;

  logger.info(
    colorOutput({
      item: INFO.FUND_ADDRESS_FUNDS,
      value: `${bitcoinCash.toBitcoinCash(value)} BCH`,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.FUND_ADDRESS_INSTRUCTION,
      style: OutputStyles.Information,
      lineabreak: true,
    }),
  );
};

export default displayFundAddress;
