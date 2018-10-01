## Golden Ticket

Event paper wallet generator

### Setup

1. Clone the repo

- `git clone https://github.com/Bitcoin-com/golden-ticket.git`

2. Install the dependencies

- `cd golden-ticket && npm install`

### Generate mnemonic

1. Create an English 256 bit mnemonic of 24 words.

- `npm run generate-mnemonic`

This will next generate the funder's address at HD path: `m/44'/145'/0'/1/0`. It will also show the funder's address as a QR code and save the mnemonic and funder address to `mnemonic.js`.

### Create addresses

1. Open `create-addresses.js` and add your mnemonic
2. `npm run create-addresses`. This will create `n` paper wallets w/ cashAddr and privkeyWIF. This will also create `addresses.csv` for importing in to a spreadsheet.

### Redeem Unclaimed Funds

1. Open `redeem-unclaimed-funds.js` and add your mnemonic
2. `npm run redeem-unclaimed-funds` to have funds sent back to the funders cashAddr
