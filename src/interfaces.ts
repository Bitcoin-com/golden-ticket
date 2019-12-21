import { locales, enStrings } from "./i18n";

export interface Mothership {
  fullNodePath: string;
  address: string;
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
export interface CreateTicketsUserInput {
  title: string;
  hdAccount: string;
  ticketCount: number;
}

export interface WalletInfo {
  strings: SectionStrings;
  error?: Error;
  data?: {
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
  | "check-tickets"
  | "create-csv"
  | "CREATE_TICKETS"
  | "fund-mothership"
  | "fund-tickets"
  | "generate-state"
  | "GENERATE_WALLETS"
  | "reclaim-funds";

export type Locale = keyof typeof locales;

export type Strings = {
  [K in keyof typeof enStrings]: typeof enStrings[K];
};

export type SectionStrings = Strings["GENERATE_WALLETS"] &
  Strings["CREATE_TICKETS"] &
  Strings["SCRIPTS"];

export interface AddressesCommon {
  hdAccount: string;
  ticketCount: string;
}

export interface Wallet {
  mnemonic: string;
  hdpath: string;
  mothership: {
    hdPath: string;
    address: string;
  };
}

export interface CreateTicketsResult extends AddressesCommon {
  eventName: string;
}
export interface PDF {
  width: string;
  height: string;
}
