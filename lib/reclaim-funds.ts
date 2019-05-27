// imports
import { BITBOX } from "bitbox-sdk"
import { AddressUtxoResult } from "bitcoin-com-rest"
import { ECPair, HDNode } from "bitcoincashjs-lib"
import { ReclaimFunds, Wallet } from "./interfaces/GoldenTicketInterfaces"

// consts
const bitbox: BITBOX = new BITBOX()
const sleep: any = (ms: number): any =>
  new Promise(resolve => setTimeout(resolve, ms))
const prompt: any = require("prompt")

// Open the wallet generated with generate-wallet.
const main: any = async (): Promise<any> => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["hdAccount", "ticketCount", "receiveAddress"],
    async (err: any, result: ReclaimFunds): Promise<any> => {
      try {
        // Open the wallet generated with generate-wallet.
        const wallet: Wallet = require(`../goldenTicketWallet.json`)

        // ticket count
        const ticketCount: number = parseInt(result.ticketCount)

        // root seed buffer
        const rootSeed: Buffer = bitbox.Mnemonic.toSeed(wallet.mnemonic)

        // master HDNode
        const masterHDNode: HDNode = bitbox.HDNode.fromSeed(rootSeed)

        const bip44: HDNode = bitbox.HDNode.derivePath(
          masterHDNode,
          wallet.hdpath
        )

        for (let i: number = 0; i <= ticketCount; i++) {
          await sleep(1100)

          const node: HDNode = bitbox.HDNode.derivePath(
            bip44,
            `${result.hdAccount ? result.hdAccount : 0}'/0/${i}`
          )

          // get the cash address
          const cashAddress: string = bitbox.HDNode.toCashAddress(node)
          const utxos:
            | AddressUtxoResult
            | AddressUtxoResult[] = await bitbox.Address.utxo(cashAddress)
          if (!Array.isArray(utxos)) {
            const utxo: AddressUtxoResult["utxos"] = utxos.utxos

            if (utxo && utxo.length >= 1) {
              console.log(`${cashAddress} utxo: `, utxo)
              utxo.forEach(
                async (u: any): Promise<any> => {
                  const transactionBuilder: any = new bitbox.TransactionBuilder()
                  const originalAmount: number = u.satoshis
                  const txid: string = u.txid
                  transactionBuilder.addInput(txid, u.vout)
                  const byteCount: number = bitbox.BitcoinCash.getByteCount(
                    { P2PKH: 1 },
                    { P2PKH: 1 }
                  )
                  const sendAmount: number = originalAmount - byteCount
                  transactionBuilder.addOutput(
                    result.receiveAddress,
                    sendAmount
                  )
                  const keyPair: ECPair = bitbox.HDNode.toKeyPair(node)
                  let redeemScript: undefined
                  transactionBuilder.sign(
                    0,
                    keyPair,
                    redeemScript,
                    transactionBuilder.hashTypes.SIGHASH_ALL,
                    originalAmount
                  )
                  const tx: any = transactionBuilder.build()
                  const hex: string = tx.toHex()
                  // console.log("HEX: ", hex)
                  const success: string = await bitbox.RawTransactions.sendRawTransaction(
                    hex
                  )
                  console.log("SUCCESS: ", success)
                }
              )
            }
          }
        }
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }
    }
  )
}

main()
