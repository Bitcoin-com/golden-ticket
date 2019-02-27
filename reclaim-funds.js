"use strict"
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const prompt = require("prompt")

// Open the wallet generated with generate-wallet.
const main = async () => {
  // start the prompt to get user input
  prompt.start()

  // ask for language, hdpath and walletFileName
  prompt.get(["hdAccount", "addressCount"], async (err, result) => {
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

    // HDNode of BIP44 account
    const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
    for (let i = 0; i <= addressCount; i++) {
      await sleep(1100)
      // derive the ith external change address HDNode
      const node = BITBOX.HDNode.derivePath(account, `${result.hdAccount}/${i}`)

      // get the cash address
      const cashAddress = BITBOX.HDNode.toCashAddress(node)
      const u = await BITBOX.Address.utxo(cashAddress)
      const utxo = u[0]
      console.log("utxo: ", utxo)
      if (utxo) {
        const transactionBuilder = new BITBOX.TransactionBuilder()
        const originalAmount = utxo.satoshis
        const txid = utxo.txid
        transactionBuilder.addInput(txid, utxo.vout)
        const byteCount = BITBOX.BitcoinCash.getByteCount(
          { P2PKH: 1 },
          { P2PKH: 1 }
        )
        const sendAmount = originalAmount - byteCount
        transactionBuilder.addOutput(
          "bitcoincash:qqjxytzkrd732s8z9c7m0a09ftk4347lyue3t4qjsj",
          sendAmount
        )
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
        const result = BITBOX.RawTransactions.sendRawTransaction(hex)
        console.log(result)
      }
    }
  })
}

main()
