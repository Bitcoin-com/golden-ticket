export interface GenerateWalletResult {
  language: string
  walletFileName: string
}

export interface AddressesCommon {
  hdAccount: string
  addressCount: string
}

export interface FundAddressesResult extends AddressesCommon {}

export interface CreateAddressesResult extends AddressesCommon {
  eventName: string
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

export interface CreateCSV extends CreateAddressesResult {}
export interface CheckAddresses extends CreateAddressesResult {}

export interface CSV {
  cashAddress: string
  wif: string
  claimed: boolean
  value?: number
}
