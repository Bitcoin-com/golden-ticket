/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import {
  HDNode as BBHDNode,
  BitcoinCash,
  Mnemonic,
  RawTransactions,
  TransactionBuilder,
} from 'bitbox-sdk';
import { ECPair, HDNode } from 'bitcoincashjs-lib';
import { getLogger } from 'log4js';
import getUTXOs from '../helpers/getUTXOs';
import selectCampaign from '../prompts/selectCampaign';
import { getLocales } from '../i18n';
import settings from '../../settings.json';

const logger = getLogger('fundTickets');
const strings = getLocales(settings.locale);
// Open the wallet generated with generate-wallet.
const main = async (): Promise<void> => {
  try {
    logger.debug('fundTickets');

    const campaignData = await selectCampaign();
    if (!campaignData) return;

    // const wifs = await getCampaignWIFs(campaignData.title);

    /*     const transaction = await buildTransaction({ ticketCount });
    console.log(transaction);
 */
    if (strings) return;

    const utxos = await getUTXOs(campaignData.mothership.address);

    const mnemonic = new Mnemonic();
    const hdnode = new BBHDNode();

    const rootSeed: Buffer = mnemonic.toSeed(campaignData.mothership.mnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const mothership: HDNode = hdnode.derivePath(
      masterHDNode,
      campaignData.mothership.fullNodePath,
    );
    const account: HDNode = hdnode.derivePath(masterHDNode, `m/44'/145'/0'`);

    if (!Array.isArray(utxos)) {
      if (!utxos.utxos[0]) return;

      const transactionBuilder = new TransactionBuilder();
      const bitcoinCash = new BitcoinCash();

      const originalAmount: number = utxos.utxos[0].satoshis;
      const { vout } = utxos.utxos[0];
      const { txid } = utxos.utxos[0];

      transactionBuilder.addInput(txid, vout);

      const byteCount: number = bitcoinCash.getByteCount(
        { P2PKH: 1 },
        { P2PKH: campaignData.tickets.count },
      );

      const sendAmount: number = originalAmount - byteCount;

      const tmpIterator = 20; // parseInt(iterator);

      const iterator: number = tmpIterator || 0;
      for (
        let i: number = iterator;
        i < campaignData.tickets.count + iterator;
        i++
      ) {
        // derive the ith external change address HDNode
        const node: HDNode = hdnode.derivePath(account, `0/${i}`);

        // get the cash address
        const cashAddress: string = hdnode.toCashAddress(node);
        const wif: string = hdnode.toWIF(node);

        console.log(i, cashAddress, wif);
        // add output w/ address and amount to send
        transactionBuilder.addOutput(
          cashAddress,
          Math.floor(sendAmount / campaignData.tickets.count),
        );
      }

      const keyPair: ECPair = hdnode.toKeyPair(mothership);

      // sign w/ HDNode
      let redeemScript: undefined;
      transactionBuilder.sign(
        0,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount,
      );

      // build tx
      const tx = transactionBuilder.build();
      // output rawhex
      const hex: string = tx.toHex();
      const rawTransactions = new RawTransactions();
      // sendRawTransaction to running BCH node
      const success: string = await rawTransactions.sendRawTransaction(hex);
      console.log('Success! TXID: ', success);
      console.log(
        `Check your transaction on the explorer: https://explorer.bitcoin.com/bch/tx/${success}`,
      );
    }
  } catch (err) {
    console.log(
      `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`,
    );
    process.exit(0);
  }
};

export default main;
