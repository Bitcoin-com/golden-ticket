import { getLogger } from 'log4js';
import { TransactionBuilder, ECPair as BBECPair } from 'bitbox-sdk';
import { ECPair } from 'bitcoincashjs-lib';

const logger = getLogger();
const bbECPair = new BBECPair();
const bbTXBuilder = new TransactionBuilder();

/**
 * Builds transaction and returns tx hex
 *
 * @param {Utxo[]} utxos utxos list
 * @param {string} wif mothership wif
 * @param {CSV[]} distribution ticket distribution
 * @returns {Promise<string>} transaction hex
 */
const getTransactionHex = async (
  utxos: Utxo[],
  wif: string,
  distribution: CSV[],
): Promise<string> => {
  try {
    // mothership keypair
    const keyPair: ECPair = bbECPair.fromWIF(wif);

    // empty redeem script
    let redeemScript: undefined;

    // add inputs
    utxos.forEach(utxo => {
      bbTXBuilder.addInput(utxo.txid, utxo.vout);
    });

    // add outputs
    distribution.forEach(ticket => {
      bbTXBuilder.addOutput(ticket.cashAddress, ticket.value);
    });

    // sign inputs
    utxos.forEach((utxo, index) => {
      bbTXBuilder.sign(
        index,
        keyPair,
        redeemScript,
        bbTXBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis,
      );
    });

    // build the transaction
    const tx = await bbTXBuilder.build();

    // return the transaction hex
    return await tx.toHex();
  } catch (error) {
    throw logger.error(error);
  }
};

export default getTransactionHex;
