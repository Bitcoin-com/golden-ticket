export interface GenerateWalletResult {
  language: string
  walletFileName: string
}

export interface CreateAddressesResult {
  eventName: string
  hdAccount: string
  addressCount: string
}

export interface Wallet {
  mnemonic: string
  hdpath: string
  mothership: {
    hdPath: string
    address: string
  }
}

export interface PDFOptions {
  width: string
  height: string
}
