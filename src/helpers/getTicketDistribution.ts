import path from 'path';
import fs from 'fs-extra';
import { BitcoinCash } from 'bitbox-sdk';
import { getLogger } from 'log4js';
import getSettings from './getSettings';

/**
 * Adjust ticket distribution
 *
 * @param {{
 *   utxos: Utxo[];
 *   campaign: Campaign;
 * }} {
 *   utxos,
 *   campaign: {
 *     title,
 *     tickets: { count, spread },
 *   },
 * }
 * @returns {{ distribution: CSV[]; adjustment: number }}
 */
const getTicketDistribution = ({
  utxos,
  campaign: {
    title,
    tickets: { count, spread },
  },
}: {
  utxos: Utxo[];
  campaign: Campaign;
}): { distribution: CSV[]; adjustment: number } => {
  const logger = getLogger();
  const settings = getSettings();

  try {
    const bbBitcoinCash = new BitcoinCash();

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
    const configFile = `${settings.outDir}/${title}/campaign.json`;
    const configPath: string = path.resolve(configFile);
    const rawFile: string = fs.readFileSync(configPath).toString();
    const baseDistribution: CSV[] = JSON.parse(rawFile);

    // adjust distribution values
    const distribution: CSV[] = baseDistribution.map((ticket: CSV) => ({
      ...ticket,
      value: ticket.value * adjustment,
    }));

    // return distribution and adjustment value
    return { distribution, adjustment };
  } catch (error) {
    throw logger.error(error);
  }
};

export default getTicketDistribution;
