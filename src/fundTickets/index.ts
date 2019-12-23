import {
  Mnemonic,
  HDNode as BB_HDNode,
  TransactionBuilder,
  BitcoinCash,
  RawTransactions
} from "bitbox-sdk";
import { HDNode, ECPair } from "bitcoincashjs-lib";
import { getLogger } from "log4js";
import { getCampaignWIFs, selectCampaign, getUTXOs } from "../helpers";
import buildTransaction from "./buildTransaction";

import { locales } from "../i18n";
import settings from "../settings.json";

// Open the wallet generated with generate-wallet.
const main: any = async (): Promise<any> => {
  try {
    const logger = getLogger("fundTickets");
    const strings = locales[settings.defaultLocale];

    const campaignData = await selectCampaign();
    if (campaignData === "CANCELED") return;

    const {
      title,
      ticketCount,
      mnemonic: mothershipMnemonic,
      mothership: { fullNodePath, address: mothershipAddress }
    } = campaignData;

    const wifs = await getCampaignWIFs(title);

    const transaction = await buildTransaction({ ticketCount });
    console.log(transaction);

    if (strings) return;

    const spacer = `







`;
    const utxos = await getUTXOs(mothershipAddress);

    const mnemonic = new Mnemonic();
    const hdnode = new BB_HDNode();

    const rootSeed: Buffer = mnemonic.toSeed(mothershipMnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const mothership: HDNode = hdnode.derivePath(masterHDNode, fullNodePath);
    const account: HDNode = hdnode.derivePath(masterHDNode, `m/44'/145'/0'`);

    if (!Array.isArray(utxos)) {
      if (!utxos.utxos[0]) return;

      const transactionBuilder: any = new TransactionBuilder();
      const bitcoinCash = new BitcoinCash();

      const originalAmount: number = utxos.utxos[0].satoshis;
      const vout: number = utxos.utxos[0].vout;
      const txid: string = utxos.utxos[0].txid;

      transactionBuilder.addInput(txid, vout);

      const byteCount: number = bitcoinCash.getByteCount(
        { P2PKH: 1 },
        { P2PKH: ticketCount }
      );

      const sendAmount: number = originalAmount - byteCount;

      let tmpIterator: number = 20; // parseInt(iterator);

      const iterator: number = tmpIterator ? tmpIterator : 0;
      for (let i: number = iterator; i < ticketCount + iterator; i++) {
        // derive the ith external change address HDNode
        const node: HDNode = hdnode.derivePath(account, `0/${i}`);

        // get the cash address
        const cashAddress: string = hdnode.toCashAddress(node);
        const wif: string = hdnode.toWIF(node);

        console.log(i, cashAddress, wif);
        // add output w/ address and amount to send
        transactionBuilder.addOutput(
          cashAddress,
          Math.floor(sendAmount / ticketCount)
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
        originalAmount
      );

      // build tx
      const tx: any = transactionBuilder.build();
      // output rawhex
      const hex: string = tx.toHex();
      const rawTransactions = new RawTransactions();
      // sendRawTransaction to running BCH node
      const success: string = await rawTransactions.sendRawTransaction(hex);
      console.log("Success! TXID: ", success);
      console.log(
        `Check your transaction on the explorer: https://explorer.bitcoin.com/bch/tx/${success}`
      );
    }
  } catch (err) {
    console.log(
      `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
    );
    process.exit(0);
  }
};

export default main();
