export interface GenerateWalletResult {
  language: string
  walletFileName: string
}

export interface Wallet {
  mnemonic: string
  hdpath: string
  mothership: {
    hdPath: string
    address: string
  }
}
