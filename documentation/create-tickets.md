# Create Golden Tickets

Once you've generated a wallet w/ `generate-wallet` you're now ready to generate your Golden Tickets via the `create-tickets` command. You'll be prompted for `eventName`, `hdAccount` and `ticketCount`

The `eventName` will be used to create subdirectories in `html/` and `pdf/`. The `hdAccount` is the BIP44 account you want to use to generate the addresses. It will default to `0'`, which is the first BIP44 account, but if you reuse the same `goldenTicketWallet` for multiple events you'll want to increment this number for each event to prevent reusing addresses. The `ticketCount` is how many golden tickets you want to create for your event.

The Golden Ticket repo comes with a nice Bitcoin.com branded background you can use. However if you want to use your own image you'll want to convert your image to Base64 via [base64-image.de](https://www.base64-image.de/). Make sure your image is less than 1MB before uploading it.

After converting you'll want to copy the base64 and paste it in to the `background-image` property in `create-tickets.ts`. Remember to run `npm run build` before running `create-tickets` if you change the background image.

`create-tickets` will first create html files in the `html/${eventName}` directory for your `ticketCount`. It will then save those html files to PDFs in the `pdf/${eventName}` directory. You'll want to confirm the PDFs look good to you and that they properly scan. Once you confirm this you can send the PDFs off to be printed for your event.

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
🚀 html and pdfs written successfully to html/exampleEvent and pdf/exampleEvent respectively.
```
