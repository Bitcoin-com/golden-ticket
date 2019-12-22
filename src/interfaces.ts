import { locales, enStrings } from "./i18n";

export interface Campaign {
  title: string;
  mnemonic: string;
  hdpath: string;
  mothership: {
    hdPath: string;
    address: string;
  };
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
export interface CreateTicketsUserInput extends WalletInfo {
  ticketCount: number;
}

export interface WalletInfo {
  strings: SectionStrings;
  error?: Error;
  data?: {
    title: string;
    filename: string;
    mnemonic: string;
    hdpath: string;
    mothership: {
      fullNodePath: string;
      address: string;
    };
  };
}

export interface Config {
  outDir: string;
  hdpath: string;
  strings: SectionStrings;
}

export type ScriptName =
  | "CHECK_TICKETS"
  | "CREATE_CSV"
  | "CREATE_TICKETS"
  | "FUND_MOTHERSHIP"
  | "FUND_TICKETS"
  | "GENERATE_STATE"
  | "GENERATE_WALLETS"
  | "RECLAIM_FUNDS";

export type Locale = keyof typeof locales;

export type Strings = {
  [K in keyof typeof enStrings]: typeof enStrings[K];
};

export type SectionStrings = Strings["GENERATE_WALLETS"] &
  Strings["CREATE_TICKETS"] &
  Strings["CREATE_CSV"] &
  Strings["FUND_MOTHERSHIP"] &
  Strings["SCRIPTS"];

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

export interface CreateCSV extends CreateTicketsResult {}

export interface CSV {
  cashAddress: string;
  wif: string;
  claimed: boolean;
  value?: number;
}
