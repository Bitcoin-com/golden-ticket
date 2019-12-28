import { BitcoinCash } from 'bitbox-sdk';
import { getLogger, configure } from 'log4js';
import { keyInYN } from 'readline-sync';
import logFundTickets from '../logger/logFundTickets';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import loggerConfig from '../helpers/loggerConfig';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';

const logger = getLogger();
configure(loggerConfig);
const settings = getSettings();
const { QUESTIONS } = getLocales(settings.locale);
const bbBitcoinCash = new BitcoinCash();

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
