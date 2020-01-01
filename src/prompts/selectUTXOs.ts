import { getLogger } from 'log4js';
import { keyIn } from 'readline-sync';

import { getLocales } from '../i18n';

import getSettings from '../helpers/getSettings';
import getUTXOs from '../helpers/getUTXOs';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';

import logFundAddress from '../logger/logFundAddress';

/**
 * Promps user with funding address. Returns UTXO set when user is satisfied
 *
 * @param {string} address
 * @returns {(Promise<Utxo[] | null>)}
 */
const updateFunds = async (address: string): Promise<Utxo[] | null> => {
  const logger = getLogger();
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);

  try {
    // get utxos for mothership address
    let utxosResult = await getUTXOs(address);
    if (Array.isArray(utxosResult) || !Array.isArray(utxosResult.utxos))
      return null;
    const { utxos } = utxosResult;

    // display funding screen
    logFundAddress(address, utxos);

    // loop while waiting for funding
    let waiting = true;
    while (waiting) {
      // display funding screen
      logFundAddress(address, utxos);

      // get user keypress
      const keypress = keyIn(
        colorOutput({
          item: QUESTIONS.FUND_UPDATE,
          value: 'r/c/x',
          style: OutputStyles.Question,
        }),
        { guide: false },
      );
      if (keypress === 'x') return null;

      // refresh utxos
      utxosResult = await getUTXOs(address);
      if (Array.isArray(utxosResult) || !Array.isArray(utxosResult.utxos))
        return null;

      // continue
      if (utxosResult.utxos[0] && keypress === 'c') waiting = false;
    }
    return utxos;
  } catch (error) {
    throw logger.error(error);
  }
};

export default updateFunds;
