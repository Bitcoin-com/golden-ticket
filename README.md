## BITBOX Scaffold React

### Intro

BITBOX scaffolds are basic apps w/ bindings to your local running BITBOX. They allow a developer to hit the ground running and waste no time w/ app set up and configuration.

This scaffold is a React app build w/ [Facebook's `create-react-app`](https://github.com/facebook/create-react-app). It already has `BITBOX` instantiated and is ready to roll.

## Setup

1. Download the latest build from [bitbox.earth](https://www.bitbox.earth/) and compare [the checksums](https://github.com/bigearth/keys-n-hashes)
2. Start your local BITBOX
3. [Install `bitbox-cli`](https://www.npmjs.com/package/bitbox-cli) globally
  * `npm install bitbox-cli --global`
4. Create empty directory for your new app
  * `mkdir BCH4all && cd BCH4all`
5. Scaffold a React app w/ BITBOX web bindings
  * `bitbox scaffold --framework react`
6. Install dependencies
  * `npm install`
7. Start the app
  * `npm start`
8. Open a browser to `http://localhost:3000/` and confirm you are seeing the `getinfo` method returning data from your local BITBOX
9. Win

## Troubleshooting

### `sh: react-scripts: command not found` error?

Run `npm install` before you run `npm start`

### `OPTIONS http://127.0.0.1:8332/ net::ERR_CONNECTION_REFUSED` error?

Start your local BITBOX before running `npm start`
