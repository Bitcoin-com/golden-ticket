import readlineSync from 'readline-sync';
import { getLogger } from 'log4js';
import { BitcoinCash } from 'bitbox-sdk';
import getSettings from './getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from './colorFormatters';
import getUTXOs from './getUTXOs';
import displayFundTickets from '../logger/displayFundTickets';
import getCampaignDistribution from './getCampaignDistribution';
import fundInit from './fundInit';

const logger = getLogger();
const settings = getSettings();
const { QUESTIONS } = getLocales(settings.locale);

const bbBitcoinCash = new BitcoinCash();

/**
 * Funds the tickets in a campaign
 *
 * @param {Campaign} campaign
 * @returns {Promise<void>}
 */
const fundTicket = async ({
  title,
  mothership: { address, wif },
  tickets: { count, spread },
}: Campaign): Promise<void> => {
  try {
    // get and check mothership utxos
    const utxosResult = await getUTXOs(address);
    if (!utxosResult || Array.isArray(utxosResult) || !utxosResult.utxos[0])
      return;
    const { utxos } = utxosResult;

    // sum all utxo satoshis
    const inputSats: number = utxos.reduce((p, c) => p + c.satoshis, 0);
    // calculate byte tx count
    const byteCount: number = bbBitcoinCash.getByteCount(
      { P2PKH: utxos.length },
      { P2PKH: count },
    );
    // total send amount
    const sendAmount: number = inputSats - byteCount;

    // calculate total value distribution
    let prevKey = count;
    const spreadKeys = Object.keys(spread).reverse();
    const valueDistribution = spreadKeys.reduce((prev, curr) => {
      const tickets = prevKey - Number(curr);
      prevKey = Number(curr);
      return prev + tickets * spread[curr];
    }, 0);

    // ticket value adjustment multiplier
    const adjustment: number = Math.floor(sendAmount / valueDistribution);

    // get distribution data from campaign.json
    const distribution: CSV[] = getCampaignDistribution(title);

    // adjust distribution values
    const adjustedDistribution: CSV[] = distribution.map((ticket: CSV) => ({
      ...ticket,
      value: ticket.value * adjustment,
    }));

    // display adjusted ticket values
    displayFundTickets({
      funds: `${bbBitcoinCash.toBitcoinCash(inputSats)} BCH\n`,
      tickets: { count, spread },
      title,
      adjustment,
    });

    // prompt to build transaction
    const initFund = readlineSync.keyInYN(
      colorOutput({
        item: QUESTIONS.FUND_CONFIRM,
        style: OutputStyles.Question,
      }),
    );

    if (initFund) {
      await fundInit(utxos, wif, adjustedDistribution);
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundTicket;
