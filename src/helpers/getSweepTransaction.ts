import { getLogger } from 'log4js';
import {
  TransactionBuilder,
  ECPair as BBECPair,
  BitcoinCash,
} from 'bitbox-sdk';
import { ECPair } from 'bitcoincashjs-lib';

/**
 * Builds a transaction for sweeping unclaimed tickets
 *
 * @param {((Utxo & { wif: string })[])} inputs
 * @param {string} outAddress
 * @returns {Promise<string>}
 */
const getSweepTransaction = async (
  inputs: (Utxo & { wif: string })[],
  outAddress: string,
): Promise<TransactionBuilder> => {
  const logger = getLogger();
  const bbECPair = new BBECPair();
  const bbTXBuilder = new TransactionBuilder();
  const bbBitcoinCash = new BitcoinCash();

  try {
    // calculate byte tx count
    const byteCount: number = bbBitcoinCash.getByteCount(
      { P2PKH: inputs.length },
      { P2PKH: 1 },
    );

    // add inputs and sum satoshis
    let inputSats = 0;
    inputs.forEach(utxo => {
      bbTXBuilder.addInput(utxo.txid, utxo.vout);
      inputSats += utxo.satoshis;
    });

    // subtract miner fee
    const sendAmount: number = inputSats - byteCount;

    // add the output
    bbTXBuilder.addOutput(outAddress, sendAmount);

    // sign the inputs
    inputs.forEach((utxo, idx) => {
      const keyPair: ECPair = bbECPair.fromWIF(utxo.wif);
      let redeemScript: undefined;
      const {
        hashTypes: { SIGHASH_ALL },
      } = bbTXBuilder;

      bbTXBuilder.sign(idx, keyPair, redeemScript, SIGHASH_ALL, utxo.satoshis);
    });

    // return the transaction hex
    return bbTXBuilder;
  } catch (error) {
    throw logger.error(error);
  }
};

export default getSweepTransaction;
