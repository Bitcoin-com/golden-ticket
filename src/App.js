import React, { Component } from 'react';
import logo from './logo.png';

import './App.css';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: '127.0.0.1',
  port: 8332,
  username: '',
  password: '',
  corsproxy: 'remote'
});

let langs = [
  'english',
  'chinese_simplified',
  'chinese_traditional',
  'korean',
  'japanese',
  'french',
  'italian',
  'spanish'
]

let lang = langs[Math.floor(Math.random()*langs.length)];

// create 256 bit BIP39 mnemonic
let mnemonic = BITBOX.Mnemonic.generate(256, BITBOX.Mnemonic.wordLists()[lang])

// root seed buffer
let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash');

// HDNode of BIP44 account
let account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

// derive the first external change address HDNode which is going to spend utxo
let change = BITBOX.HDNode.derivePath(account, "0/0");

// get the cash address
let cashAddress = BITBOX.HDNode.toCashAddress(change);

let hex;

BITBOX.Address.utxo(cashAddress).then((result) => {
  if(!result[0]) {
    return;
  }

  // instance of transaction builder
  let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash');
  // original amount of satoshis in vin
  let originalAmount = result[0].satoshis;

  // index of vout
  let vout = result[0].vout;

  // txid of vout
  let txid = result[0].txid;

  // add input with txid and index of vout
  transactionBuilder.addInput(txid, vout);

  // get byte count to calculate fee. paying 1 sat/byte
  let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 });
  // 192
  // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
  let sendAmount = originalAmount - byteCount;

  // add output w/ address and amount to send
  transactionBuilder.addOutput(cashAddress, sendAmount);

  // keypair
  let keyPair = BITBOX.HDNode.toKeyPair(change);

  // sign w/ HDNode
  let redeemScript;
  transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);

  // build tx
  let tx = transactionBuilder.build();
  // output rawhex
  let hex = tx.toHex();

  // sendRawTransaction to running BCH node
  BITBOX.RawTransactions.sendRawTransaction(hex).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });
}, (err) => {
  console.log(err);
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: mnemonic,
      lang: lang,
      hex: hex,
    }
  }

  render() {
    let addresses = [];
    for(let i = 0; i < 10; i++) {
      let account = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
      addresses.push(<li key={i}>m/44&rsquo;/145&rsquo;/0&rsquo;/0/{i}: {BITBOX.HDNode.toCashAddress(account)}</li>);
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello BITBOX</h1>
        </header>
        <div className='App-content'>
          <h2>BIP44 $BCH Wallet</h2>
          <h3>256 bit {lang} BIP39 Mnemonic:</h3> <p>{this.state.mnemonic}</p>
          <h3>BIP44 Account</h3>
          <p>
            <code>
            "m/44'/145'/0'"
            </code>
          </p>
          <h3>BIP44 external change addresses</h3>
          <ul>
            {addresses}
          </ul>
          <h3>Transaction raw hex</h3>
          <p>{this.state.hex}</p>
        </div>
      </div>
    );
  }
}

export default App;
