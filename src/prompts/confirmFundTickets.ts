import { BitcoinCash } from 'bitbox-sdk';
import { keyInYN } from 'readline-sync';
import logFundTickets from '../logger/logFundTickets';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';

/**
 * Promps user to confirm funding transaction
 *
 * @param {{
 *   adjustment: number;
 *   utxos: Utxo[];
 *   campaign: Campaign;
 * }} {
 *   adjustment,
 *   utxos,
 *   campaign: {
 *     title,
 *     tickets: { count, spread },
 *   },
 * }
 * @returns {(string | boolean)}
 */
const confirmFundTickets = ({
  adjustment,
  utxos,
  campaign: {
    title,
    tickets: { count, spread },
  },
}: {
  adjustment: number;
  utxos: Utxo[];
  campaign: Campaign;
}): string | boolean => {
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);
  const bbBitcoinCash = new BitcoinCash();

  // total available funds in utxos
  const funds = `${bbBitcoinCash.toBitcoinCash(
    utxos.reduce((p, c) => p + c.satoshis, 0),
  )} BCH\n`;

  // display adjusted ticket values
  logFundTickets({
    funds,
    tickets: { count, spread },
    title,
    adjustment,
  });

  // prompt to build transaction
  return keyInYN(
    colorOutput({
      item: QUESTIONS.FUND_CONFIRM,
      style: OutputStyles.Question,
    }),
  );
};

export default confirmFundTickets;
