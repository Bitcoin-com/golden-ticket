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
      errors: ''
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
        errors: result.errors
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
        </div>
      </div>
    );
  }
}

export default App;
