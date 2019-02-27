"use strict"
const BITBOXCli = require("bitbox-cli/lib/bitbox-cli").default
const BITBOX = new BITBOXCli()

// Open the wallet generated with generate-wallet.
const main = async () => {
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

  const addressCount = 49

  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonicObj.mnemonic)

  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

  const mothershipAccount = BITBOX.HDNode.derivePath(
    masterHDNode,
    "m/44'/145'/1'"
  )

  const mothership = BITBOX.HDNode.derivePath(mothershipAccount, `0/0`)

  const mothershipAddress = BITBOX.HDNode.toCashAddress(mothership)
  console.log("mothership addy", mothershipAddress)
  // return

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  const result = await BITBOX.Address.utxo([mothershipAddress])
  console.log(result[0][0])
  if (!result[0][0]) return

  const transactionBuilder = new BITBOX.TransactionBuilder()
  const originalAmount = result[0][0].satoshis
  // console.log("originalAmount", originalAmount)

  const vout = result[0][0].vout

  const txid = result[0][0].txid
  console.log("TXID", txid)

  transactionBuilder.addInput(txid, vout)
  console.log("input added")

  const byteCount = BITBOX.BitcoinCash.getByteCount(
    { P2PKH: 1 },
    { P2PKH: addressCount }
  )

  const sendAmount = originalAmount - byteCount
  // console.log("byte count", byteCount)
  // const changeAmount = sendAmount - 9764550

  // transactionBuilder.addOutput(mothershipAddress, sendAmount)
  const foo = 2426
  for (let i = foo; i < addressCount + foo; i++) {
    // derive the ith external change address HDNode
    const node = BITBOX.HDNode.derivePath(account, `9/${i}`)

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
  // console.log("HEX: ", hex)

  // sendRawTransaction to running BCH node
  const success = await BITBOX.RawTransactions.sendRawTransaction(hex)
  console.log("Success! TXID: ", success)
}

main()
