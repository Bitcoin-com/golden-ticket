# Generate Wallet

The first step in creating Golden Tickets for your event is to generate a light-weight wallet which will be used in subsequent steps.

Start by running `generate-wallet`. You'll be prompted for a `language`. You can choose the default language of `english` by simply not entering a `language` and just pressing enter/return. Valid options are:

- english
- japanese
- chinese_simplified
- chinese_traditional
- french
- italian
- japanese
- korean
- spanish

`generate-wallet` will create a 256 bit mnemonic of the language of your choice and write that mnemonic along with the standard BIP44 HDPath (`m/44'/145'`) and your mothership's HDPath and address to a `goldenTicketWallet.json` file. The mothership is just the address which you send your funds to before running the `fund-addresses` script. It's the first external change address of the first BIP44 account: `m/44'/145'/0'/1/0`

Here's an example generating a default english wallet.

```
npm run generate-wallet

prompt: language:
Your mnemonic is: cupboard apple enhance social half spread pride rare point brown invest aisle mansion normal asset connect father banana wasp remain bullet inform high inhale
Your base HDPath is m/44'/145'
Your mothership's HDPath is m/44'/145'/0'/1/0
Your mothership's cash address is bitcoincash:qrujcftgjqf8jsjn97wgas0v7ayen7kn95l2e3sknu
All done. ✅
🚀 goldenTicketWallet.json written successfully.
```

Here's an example generating a japanese wallet.

```
npm run generate-wallet

prompt: language:  japanese
Your mnemonic is: えんかい　なわとび　すいか　ねつぞう　げきだん　たなばた　そなえる　せはば　れいぞうこ　いせかい　はかい　いもたれ　せんやく　ほんけ　こんき　はかる　とらえる　こわもて　きえる　はけん　おばさん　るりがわら　さばく　こうえん
Your base HDPath is m/44'/145'
Your mothership's HDPath is m/44'/145'/0'/1/0
Your mothership's cash address is bitcoincash:qpedc03fe6k4zsmy0228u43wh8m00s3xfqqut0c5lx
All done. ✅
🚀 goldenTicketWallet.json written successfully.
```

After running `generate-wallet` you can always check the contents of your `goldenTicketWallet.json`

```
cat goldenTicketWallet.json

{
  "mnemonic": "えんかい　なわとび　すいか　ねつぞう　げきだん　たなばた　そなえる　せはば　れいぞうこ　いせかい　はかい　いもたれ　せんやく　ほんけ　こんき　はかる　とらえる　こわもて　きえる　はけん　おばさん　るりがわら　さばく　こうえん",
  "hdpath": "m/44'/145'",
  "mothership": {
    "hdPath": "m/44'/145'/0'/1/0",
    "address": "bitcoincash:qpedc03fe6k4zsmy0228u43wh8m00s3xfqqut0c5lx"
  }
}
```
