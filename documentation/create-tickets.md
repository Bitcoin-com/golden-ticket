# Create Golden Tickets

Once you've generated a wallet w/ `generate-wallet` you're now ready to generate your Golden Tickets via the `create-golden-tickets` command. You'll be prompted for `eventName`, `hdAccount` and `ticketCount`

The `eventName` will be used to create subdirectories in `html/` and `pdf/`. The `hdAccount` is the BIP44 account you want to use to generate the addresses. It will default to `0'`, which is the first BIP44 account, but if you reuse the same `goldenTicketWallet` for multiple events you'll want to increment this number for each event to prevent reusing addresses.

The `ticketCount` is how many golden tickets you want to create for your event.

[base64-image.de](https://www.base64-image.de/)

```
npm run create-golden-tickets

prompt: eventName:  exampleEvent
prompt: hdAccount:  0
prompt: ticketCount:  5
html: 0
html: 1
html: 2
html: 3
html: 4
pdf: 0
pdf: 1
pdf: 2
pdf: 3
pdf: 4
All done. ✅
🚀 html and pdfs written successfully.
```
