import React, { Component } from 'react';
import logo from './logo.png';

import './App.css';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: '127.0.0.1',
  port: 8332,
  username: '',
  password: ''
});

let mnemonic = BITBOX.Mnemonic.generateMnemonic(256, BITBOX.Mnemonic.mnemonicWordLists().korean)
let rootSeedHex = BITBOX.Mnemonic.mnemonicToSeedHex(mnemonic)
let masterHDNode = BITBOX.HDNode.fromSeedHex(rootSeedHex)
let childNode = masterHDNode.derivePath("m/44'/145'/0'/0/0")
let cashAddress = BITBOX.HDNode.toCashAddress(childNode)
let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash');
let keyPair = childNode.keyPair;
let txid = '5699610b1db28d77b1021ed457d5d9010900923143757bc8698083fa796b3307';
transactionBuilder.addInput(txid, 1, keyPair);
let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 });
let originalAmount = 3678031;
let sendAmount = originalAmount - byteCount; 
transactionBuilder.addOutput('qpq57nsrhje3725fzxfjdqzdngep3cfk2sfmy8yexj', sendAmount);
transactionBuilder.sign(0, originalAmount);
let tx = transactionBuilder.build();
let hex = tx.toHex(); 


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
      protocolversion: '',
      walletversion: '',
      balance: '',
      blocks: '',
      timeoffset: '',
      connections: '',
      proxy: '',
      difficulty: '',
      testnet: '',
      keypoololdest: '',
      keypoolsize: '',
      paytxfee: '',
      relayfee: '',
      errors: '',
      mnemonic: mnemonic,
      cashaddress: cashAddress,
      hex: hex,
    }
  }

  componentDidMount() {
    BITBOX.Control.getInfo()
    .then((result) => {
      this.setState({
        version: result.version,
        protocolversion: result.protocolversion,
        walletversion: result.walletversion,
        balance: result.balance,
        blocks: result.blocks,
        timeoffset: result.timeoffset,
        connections: result.connections,
        proxy: result.proxy,
        difficulty: result.difficulty,
        testnet: result.testnet,
        keypoololdest: result.keypoololdest,
        keypoolsize: result.keypoolsize,
        paytxfee: result.paytxfee,
        relayfee:result.relayfee,
        errors: result.errors,
        mnemonic: result.mnemonic,
        cashaddress: result.cashaddress,
        hex: result.hex
      });
    }, (err) => { console.log(err);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello BITBOX</h1>
        </header>
        <div className='App-content'>
          <h2><code>getinfo</code></h2>
          <ul>
            <li>
                version: {this.state.version},
            </li>
            <li>
                protocolversion: {this.state.protocolversion},
            </li>
            <li>
                walletversion: {this.state.walletversion},
            </li>
            <li>
                balance: {this.state.balance},
            </li>
            <li>
                blocks: {this.state.blocks},
            </li>
            <li>
                timeoffset: {this.state.timeoffset},
            </li>
            <li>
                connections: {this.state.connections},
            </li>
            <li>
                proxy: {this.state.proxy},
            </li>
            <li>
                difficulty: {this.state.difficulty},
            </li>
            <li>
                testnet: {this.state.testnet},
            </li>
            <li>
                keypoololdest: {this.state.keypoololdest},
            </li>
            <li>
                keypoolsize: {this.state.keypoolsize},
            </li>
            <li>
                paytxfee: {this.state.paytxfee},
            </li>
            <li>
                relayfee:{this.state.relayfee},
            </li>
            <li>
                errors: {this.state.errors}
            </li>
            </ul>
           <h2>mnemonic:</h2> <p>{this.state.mnemonic}</p>
           <h2>cashaddress:</h2> <p>{this.state.cashaddress}</p>
           <h2>hex:</h2> <p>{this.state.hex}</p>
        </div>
      </div>
    );
  }
}

export default App;
