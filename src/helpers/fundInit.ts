/* eslint-disable @typescript-eslint/no-misused-promises */
import { keyInYN, keyInPause } from 'readline-sync';
import { getLogger } from 'log4js';
import {
  TransactionBuilder,
  ECPair as BBECPair,
  RawTransactions,
} from 'bitbox-sdk';
import { ECPair } from 'bitcoincashjs-lib';
import { getLocales } from '../i18n';
import getSettings from './getSettings';
import { colorOutput, OutputStyles } from './colorFormatters';
import sleep from './sleep';
import logTransaction from '../logger/logTransaction';

const fundInit = async (
  utxos: Utxo[],
  wif: string,
  distribution: CSV[],
): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();
  const { QUESTIONS } = getLocales(settings.locale);

  const bbECPair = new BBECPair();
  const bbRawTransaction = new RawTransactions();
  const transactionBuilder = new TransactionBuilder();

  try {
    const keyPair: ECPair = bbECPair.fromWIF(wif);
    let redeemScript: undefined;

    let totalInputSats = 0;
    let totalOutputSats = 0;

    // add inputs
    utxos.forEach(utxo => {
      transactionBuilder.addInput(utxo.txid, utxo.vout);
      totalInputSats += utxo.satoshis;
    });

    // add outputs
    distribution.forEach(ticket => {
      transactionBuilder.addOutput(ticket.cashAddress, ticket.value);
      totalOutputSats += ticket.value;
    });

    // sign inputs
    utxos.forEach((utxo, index) => {
      transactionBuilder.sign(
        index,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis,
      );
    });

    const tx = await transactionBuilder.build();
    const hex: string = await tx.toHex();

    console.log(
      totalInputSats,
      totalOutputSats,
      totalInputSats - totalOutputSats,
    );
    const send = keyInYN(
      colorOutput({
        item: 'Send transaction?',
        style: OutputStyles.Question,
      }),
    );
    if (send) {
      const success: string = await bbRawTransaction.sendRawTransaction(hex);
      console.log(success);
      keyInPause(colorOutput({ item: QUESTIONS.CONTINUE }));
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default fundInit;
