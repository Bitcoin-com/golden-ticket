"use strict"
const BITBOXSDK = require("bitbox-sdk")
const BITBOX = new BITBOXSDK()
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
        `Could not open mnemonic.json. Generate a mnemonic with generate-wallet first.
      Exiting.`
      )
      process.exit(0)
    }

    const addressCount = result.addressCount

    const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

    const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

    const mothership = BITBOX.HDNode.derivePath(
      masterHDNode,
      mnemonicObj.mothership.hdPath
    )

    const mothershipAddress = BITBOX.HDNode.toCashAddress(mothership)
    console.log("mothership addy", mothershipAddress)
    // return

    // HDNode of BIP44 account
    const account = BITBOX.HDNode.derivePath(
      masterHDNode,
      `m/44'/145'/${result.hdAccount}'`
    )

    const utxos = await BITBOX.Address.utxo(mothershipAddress)
    console.log(utxos.utxos[0])
    if (!utxos.utxos[0]) return

    const transactionBuilder = new BITBOX.TransactionBuilder()
    const originalAmount = utxos.utxos[0].satoshis
    // console.log("originalAmount", originalAmount)

    const vout = utxos.utxos[0].vout

    const txid = utxos.utxos[0].txid

    transactionBuilder.addInput(txid, vout)

    const byteCount = BITBOX.BitcoinCash.getByteCount(
      { P2PKH: 1 },
      { P2PKH: addressCount }
    )
    console.log("BYTE COUNT", byteCount)

    const sendAmount = originalAmount - byteCount
    // console.log("byte count", byteCount)
    // const changeAmount = sendAmount - 9764550

    // transactionBuilder.addOutput(mothershipAddress, sendAmount)
    const foo = 269
    console.log("address count", addressCount)
    for (let i = foo; i < Number(addressCount) + foo; i++) {
      // derive the ith external change address HDNode
      const node = BITBOX.HDNode.derivePath(account, `0/${i}`)

      // get the cash address
      const cashAddress = BITBOX.HDNode.toCashAddress(node)
      // let cashAddress = "pz9dywrhv03h54xkyl7mmgs9memtjgjzycw5fcxdzn";
      const wif = BITBOX.HDNode.toWIF(node)

      console.log(i, cashAddress, wif)
      // add output w/ address and amount to send
      transactionBuilder.addOutput(
        cashAddress,
        Math.floor(sendAmount / addressCount)
      )
    }

    const keyPair = BITBOX.HDNode.toKeyPair(mothership)

    // sign w/ HDNode
    let redeemScript
    transactionBuilder.sign(
      0,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    )

    // build tx
    const tx = transactionBuilder.build()
    // output rawhex
    const hex = tx.toHex()
    console.log("HEX: ", hex)

    // sendRawTransaction to running BCH node
    const success = await BITBOX.RawTransactions.sendRawTransaction(hex)
    console.log("Success! TXID: ", success)
  })
}

main()
