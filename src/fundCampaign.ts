import { getLogger, configure } from 'log4js';
import { keyIn, keyInPause } from 'readline-sync';
import bchaddr from 'bchaddrjs-slp';

import loggerConfig from './helpers/loggerConfig';
import selectCampaign from './prompts/selectCampaign';
import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import getSettings from './helpers/getSettings';
import { getLocales } from './i18n';
import displayFundAddress from './helpers/displayFundAddress';
import getUTXOs from './helpers/getUTXOs';
import fundTickets from './helpers/fundTickets';

const logger = getLogger();
configure(loggerConfig);
const settings = getSettings();

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const fundCampaign = async (): Promise<void> => {
  const { QUESTIONS, DEFAULTS } = getLocales(settings.locale);
  logger.debug('init');

  try {
    const campaign = await selectCampaign();
    if (!campaign) return;

    const {
      mothership: { address },
    } = campaign;

    const slp = keyIn(
      colorOutput({
        item: 'BCH or SLP',
        value: 'b:bch/s:slp',
        style: OutputStyles.Question,
      }),
      { defaultInput: 'b' },
    );

    const displayAddress =
      slp === 's' ? bchaddr.toSlpAddress(address) : address;

    displayFundAddress(displayAddress);

    let utxos = await getUTXOs(address);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      displayFundAddress(displayAddress, utxos);
      const keypress = keyIn(
        colorOutput({
          item: QUESTIONS.FUND_UPDATE,
          value: DEFAULTS.FUND_UPDATE,
          style: OutputStyles.Question,
        }),
        { guide: false },
      );

      utxos = await getUTXOs(address);

      if (!Array.isArray(utxos)) {
        if (!utxos.utxos[0]) break;

        if (utxos.utxos.length !== 0 && keypress === 'c') {
          await fundTickets(campaign);
          break;
        }
      }

      if (keypress === 'x') break;
    }
  } catch (error) {
    logger.error(error);
    keyInPause();
    throw logger.error(error);
  }
};

export default fundCampaign();
