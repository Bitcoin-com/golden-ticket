import { getLogger, configure } from 'log4js';
import { keyIn } from 'readline-sync';

import loggerConfig from '../helpers/loggerConfig';
import getSettings from '../helpers/getSettings';
import { getLocales } from '../i18n';
import getUTXOs from '../helpers/getUTXOs';
import { colorOutput, OutputStyles } from '../helpers/colorFormatters';
import logFundAddress from '../logger/logFundAddress';

const updateFunds = async (address: string): Promise<Utxo[] | null> => {
  const logger = getLogger();
  configure(loggerConfig);
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
      if (keypress === 'x') waiting = false;

      // refresh utxos
      utxosResult = await getUTXOs(address);
      if (Array.isArray(utxosResult) || !Array.isArray(utxosResult.utxos))
        return null;

      if (utxosResult.utxos[0] && keypress === 'c') waiting = false;
    }
    return utxos;
  } catch (error) {
    throw logger.error(error);
  }
};

export default updateFunds;
