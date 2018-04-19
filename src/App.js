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
  corsproxy: false
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

// mnemonic to BIP32 root seed encoded as hex
let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

// root seed to BIP32 master HD Node
let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

// derive BIP 44 external receive address
let childNode = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'/0/0")

// instance of transaction builder
let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash');

// keypair of BIP44 receive address
let keyPair = childNode.keyPair;

// txid of utxo
let txid = '5699610b1db28d77b1021ed457d5d9010900923143757bc8698083fa796b3307';

// subtract fee from original amount
let originalAmount = 3678031;

// add input txid, vin 1 and keypair
transactionBuilder.addInput(txid, 1);

// calculate fee @ 1 sat/B
let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 });

let sendAmount = originalAmount - byteCount;

// add receive address and send amount
transactionBuilder.addOutput('bitcoincash:qpuax2tarq33f86wccwlx8ge7tad2wgvqgjqlwshpw', sendAmount);

// sign tx
let redeemScript;
transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);

// build it and raw hex
let tx = transactionBuilder.build();
let hex = tx.toHex();
BITBOX.RawTransactions.sendRawTransaction(hex).then((result) => { console.log("Broadcast Result: "+result); }, (err) => { console.log("Broadcast Error: "+err); });


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
      let childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
      addresses.push(<li key={i}>m/44&rsquo;/145&rsquo;/0&rsquo;/0/{i}: {BITBOX.HDNode.toCashAddress(childNode)}</li>);
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
