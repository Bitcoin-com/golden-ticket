export interface GenerateWalletResult {
  language: string
}

export interface AddressesCommon {
  hdAccount: string
  ticketCount: string
}

export interface FundAddressesResult extends AddressesCommon {}

export interface CreateTicketsResult extends AddressesCommon {
  eventName: string
}

export interface GenerateStats {
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

export interface PDF {
  width: string
  height: string
}

export interface CreateCSV extends CreateTicketsResult {}
export interface CheckAddresses extends CreateTicketsResult {}

export interface CSV {
  cashAddress: string
  wif: string
  claimed: string
  value?: number
}

export interface ReclaimFunds {
  hdAccount: string
  addressCount: string
  receiveAddress: string
}
