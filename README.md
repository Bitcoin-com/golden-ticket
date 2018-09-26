## Golden Ticket

Event paper wallet generator

### Setup

1. Clone the repo

- `git clone https://github.com/Bitcoin-com/golden-ticket.git`

2. Install the dependencies

- `cd golden-ticket && npm install`

3. Generate a mnemonic and store it somewhere safely

- `BITBOX.Mnemonic.generate(256)`

### Fund main address

1. Open `show-funder-address.js` and add your mnemonic
2. `npm run show-funder-address`. This will display your funder's cashAddr and a QR code
3. Scan QR code and send funds

### Create addresses

1. Open `create-addresses.js` and add your mnemonic
2. `npm run create-addresses`. This will create `n` paper wallets w/ cashAddr and privkeyWIF. This will also create `addresses.csv` for importing in to a spreadsheet.

### Redeem Unclaimed Funds

1. Open `redeem-unclaimed-funds.js` and add your mnemonic
2. `npm run redeem-unclaimed-funds` to have funds sent back to the funders cashAddr
