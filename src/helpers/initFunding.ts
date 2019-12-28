import { getLogger } from 'log4js';
import { keyInPause } from 'readline-sync';
import {
  Mnemonic,
  HDNode as BBHDNode,
  Address,
  TransactionBuilder,
  BitcoinCash,
  RawTransactions,
  ECPair as BBECPair,
} from 'bitbox-sdk';
import { ECPair, HDNode } from 'bitcoincashjs-lib';

import getSettings from './getSettings';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from './colorFormatters';
import sleep from './sleep';

const logger = getLogger();
const settings = getSettings();
const { QUESTIONS, TITLES } = getLocales(settings.locale);

const initFunding = async (
  distribution: CSV[],
  campaign: Campaign,
): Promise<void> => {
  try {
    logger.info(
      colorOutput({ item: TITLES.FUND_TICKETS, style: OutputStyles.Title }),
    );

    const bbAddress = new Address();
    const bbBitcoinCash = new BitcoinCash();
    const bbRawTransaction = new RawTransactions();
    const bbECPair = new BBECPair();

    const ticketCount: number = distribution.length;

    const utxos = await bbAddress.utxo(campaign.mothership.address);

    if (Array.isArray(utxos)) return;
    if (!Array.isArray(utxos.utxos)) return;

    const transactionBuilder = new TransactionBuilder();
    const keyPair: ECPair = bbECPair.fromWIF(campaign.mothership.wif);
    let redeemScript: undefined;

    // add inputs
    utxos.utxos.forEach(utxo =>
      transactionBuilder.addInput(utxo.txid, utxo.vout),
    );

    // add outputs
    distribution.forEach(ticket => {
      transactionBuilder.addOutput(ticket.cashAddress, ticket.value);
    });

    // sign inputs
    utxos.utxos.forEach((utxo, index) =>
      transactionBuilder.sign(
        index,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis,
      ),
    );

    const tx = await transactionBuilder.build();
    const hex: string = await tx.toHex();

    console.log(tx);
    keyInPause();
    const success: string = await bbRawTransaction.sendRawTransaction(hex);

    console.log(success);
    keyInPause();
  } catch (error) {
    logger.error(error);
    keyInPause();
    throw logger.error(error);
  }
};

export default initFunding;
