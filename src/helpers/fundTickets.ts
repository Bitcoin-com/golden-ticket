import path from 'path';
import fs from 'fs-extra';
import readlineSync, { keyInPause } from 'readline-sync';
import { getLogger } from 'log4js';
import { BitcoinCash } from 'bitbox-sdk';
import getSettings from './getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from './colorFormatters';
import getUTXOs from './getUTXOs';
import displayFundTickets from './displayFundTickets';
import initFunding from './initFunding';

const logger = getLogger();
const settings = getSettings();
const { QUESTIONS } = getLocales(settings.locale);
const bbBitcoinCash = new BitcoinCash();

const fundTicket = async (campaign: Campaign): Promise<void> => {
  try {
    const {
      tickets: { count, spread },
      mothership: { address },
    } = campaign;
    const utxos = await getUTXOs(address);

    const bitcoinCash = new BitcoinCash();

    if (!utxos || Array.isArray(utxos) || !utxos.utxos[0]) return;

    const originalAmount: number = utxos.utxos.reduce(
      (p: number, c: { satoshis: number }) => p + c.satoshis,
      0,
    );

    let prevKey = count;
    const spreadKeys = Object.keys(spread).reverse();
    const distributionCount = spreadKeys.reduce((prev, curr) => {
      const val = spread[curr];
      const tickets = prevKey - Number(curr);
      prevKey = Number(curr);
      return prev + tickets * val;
    }, 0);

    const byteCount: number = bbBitcoinCash.getByteCount(
      {
        P2PKH: utxos.utxos.length,
      },
      { P2PKH: count },
    );

    const sendAmount: number = originalAmount - byteCount;
    const adjustmentAmount = Math.floor(sendAmount / distributionCount);

    console.log('totalfunds', originalAmount);
    console.log('distcount', distributionCount);
    console.log('bytecount', byteCount);
    console.log('sendamount', sendAmount);
    console.log('adjustment', adjustmentAmount);

    keyInPause();
    const distRaw = fs
      .readFileSync(
        path.resolve(`${settings.outDir}/${campaign.title}/campaign.json`),
      )
      .toString();

    const distribution = JSON.parse(distRaw);

    const adjustedDistribution = distribution.map((ticket: CSV) => {
      return { ...ticket, value: ticket.value * adjustmentAmount };
    });

    console.log(adjustedDistribution);
    keyInPause();
    displayFundTickets(
      `${bitcoinCash.toBitcoinCash(originalAmount)} BCH\n`,
      campaign,
      adjustmentAmount,
    );

    const initFund = readlineSync.keyInYN(
      colorOutput({
        item: QUESTIONS.FUND_CONFIRM,
        style: OutputStyles.Question,
      }),
    );
    if (initFund) {
      await initFunding(adjustedDistribution, campaign);
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundTicket;
