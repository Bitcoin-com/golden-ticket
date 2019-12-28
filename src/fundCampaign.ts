import { getLogger, configure } from 'log4js';
import { keyIn } from 'readline-sync';
import bchaddr from 'bchaddrjs-slp';

import loggerConfig from './helpers/loggerConfig';
import selectCampaign from './prompts/selectCampaign';
import { colorOutput, OutputStyles } from './helpers/colorFormatters';
import getSettings from './helpers/getSettings';
import { getLocales } from './i18n';
import displayFundAddress from './logger/displayFundAddress';
import getUTXOs from './helpers/getUTXOs';
import fundTickets from './helpers/fundTickets';
import displayFundType from './logger/displayFundType';

const logger = getLogger();
configure(loggerConfig);
const settings = getSettings();
const { QUESTIONS } = getLocales(settings.locale);

/**
 * Starts campaign configuration
 *
 * @returns {Promise<void>}
 */
const fundCampaign = async (): Promise<void> => {
  logger.debug('init');

  try {
    const campaign = await selectCampaign();
    if (!campaign) return;

    const {
      mothership: { address },
    } = campaign;

    displayFundType();

    const slp = keyIn(
      colorOutput({
        item: QUESTIONS.FUND_ADDRESS_TYPE,
        value: 'b/t',
        style: OutputStyles.Question,
      }),
      { defaultInput: 'b' },
    );

    const displayAddress =
      slp === 't' ? bchaddr.toSlpAddress(address) : address;

    let utxos = await getUTXOs(address);
    displayFundAddress(displayAddress, utxos);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      displayFundAddress(displayAddress, utxos);
      const keypress = keyIn(
        colorOutput({
          item: QUESTIONS.FUND_UPDATE,
          value: 'r/c/x',
          style: OutputStyles.Question,
        }),
        { guide: false },
      );
      if (keypress === 'x') break;

      utxos = await getUTXOs(address);

      if (!Array.isArray(utxos)) {
        if (utxos.utxos[0] && keypress === 'c') {
          await fundTickets(campaign);
          break;
        }
      }
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundCampaign();
