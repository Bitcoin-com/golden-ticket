# Reclaim Funds

Now that your event is over and you've generated stats for how many tickets were claimed you are ready to sweep all unclaimed the funds back to your wallet.

`reclaim-funds` takes the same `hdAccount` and `ticketCount` which you used in previous commands. It also prompts your for `receiveAddress` which is your cash address where you would like the funds returned. It then loops over each of your tickets and if it is unclaimed creates a transaction sending the funds back to your wallet.

```
npm run reclaim-funds

prompt: hdAccount:  0
prompt: ticketCount:  5
prompt: receiveAddress:  bitcoincash:qqp39jant8adjss3a40llk6sttfet0aa2yuehtfxqw
SUCCESS txid:  ca20f47c9fcb952d5e125e3ef3c802b142f146ba99ea3c35dc1ded0b70bfb627
SUCCESS txid:  525f22d7b41472db64db3471c8babe9d8bdbc38c1555df34bedbf9b58f774328
SUCCESS txid:  85da87ac0c4c8511221a80a485c2c5a881bb9895e0007201bee1acca3b026824
```
