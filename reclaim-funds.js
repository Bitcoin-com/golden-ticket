"use strict"
const BITBOXCli = require("bitbox-sdk")
const BITBOX = new BITBOXCli()
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const prompt = require("prompt")

// Open the wallet generated with generate-wallet.
const main = async () => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(
    ["hdAccount", "addressCount", "receiveAddress"],
    async (err, result) => {
      let mnemonicObj
      try {
        mnemonicObj = require(`./goldenTicketWallet.json`)
      } catch (err) {
        console.log(
          `Could not open goldenTicketWallet.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
        )
        process.exit(0)
      }

      // address count
      const addressCount = result.addressCount

      // root seed buffer
      const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

      // master HDNode
      const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

      const bip44 = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'")
      for (let i = 0; i <= addressCount; i++) {
        await sleep(1100)

        const node = BITBOX.HDNode.derivePath(
          bip44,
          `${result.hdAccount ? result.hdAccount : 0}'/0/${i}`
        )

        // get the cash address
        const cashAddress = BITBOX.HDNode.toCashAddress(node)
        const utxos = await BITBOX.Address.utxo(cashAddress)
        const utxo = utxos.utxos

        if (utxo && utxo.length >= 1) {
          console.log(`${cashAddress} utxo: `, utxo)
          utxo.forEach(u => {
            const transactionBuilder = new BITBOX.TransactionBuilder("mainnet")
            const originalAmount = u.satoshis
            const txid = u.txid
            transactionBuilder.addInput(txid, u.vout)
            const byteCount = BITBOX.BitcoinCash.getByteCount(
              { P2PKH: 1 },
              { P2PKH: 1 }
            )
            const sendAmount = originalAmount - byteCount
            transactionBuilder.addOutput(result.receiveAddress, sendAmount)
            const keyPair = BITBOX.HDNode.toKeyPair(node)
            let redeemScript
            transactionBuilder.sign(
              0,
              keyPair,
              redeemScript,
              transactionBuilder.hashTypes.SIGHASH_ALL,
              originalAmount
            )
            const tx = transactionBuilder.build()
            const hex = tx.toHex()
            // console.log("HEX: ", hex)
            const success = BITBOX.RawTransactions.sendRawTransaction(hex)
            console.log("SUCCESS: ", success)
          })
        }
      }
    }
  )
}

main()
