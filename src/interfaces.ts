import { locales } from './i18n';

/**
 * Campaign interface (wallet.json structure)
 *
 * @export
 * @interface Campaign
 */
export interface Campaign {
  title: string;
  mnemonic: string;
  hdpath: string;
  mothership: Mothership;
  ticketCount: number;
}

export interface Mothership {
  fullNodePath: string;
  address: string;
}

export interface ArgumentsMap {
  locale: Locale;
  debug?: string;
}
export interface MnemonicObject {
  mnemonic: string;
  hdpath: string;
  mothership: Mothership;
}

export type Callback = (res: { err?: object; filename?: string }) => void;

export interface GenerateWalletUserInput {
  title: string;
}

export type ScriptName =
  | 'CHECK_TICKETS'
  | 'CREATE_CSV'
  | 'CREATE_TICKETS'
  | 'FUND_MOTHERSHIP'
  | 'FUND_TICKETS'
  | 'GENERATE_STATE'
  | 'GENERATE_WALLETS'
  | 'RECLAIM_FUNDS';

export type Locale = keyof typeof locales;

export interface AddressesCommon {
  hdAccount: string;
  ticketCount: string;
}

export interface Wallet {
  title: string;
  mnemonic: string;
  hdpath: string;
  mothership: {
    hdPath: string;
    address: string;
  };
  ticketCount?: number;
}

export interface CreateTicketsResult extends AddressesCommon {
  eventName: string;
}
export interface PDF {
  width: string;
  height: string;
}

export interface CSV {
  cashAddress: string;
  wif: string;
  claimed: boolean;
  value?: number;
}
