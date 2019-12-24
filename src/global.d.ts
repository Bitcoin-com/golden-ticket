// Type definitions for Golden Ticket v3.0
// Project: golden-ticket
// Definitions by: Paul Bergamo <paul@bitcoin.com>
declare module 'to-regex-range';
declare module 'qrcode-terminal';

declare module '*.txt' {
  const content: string;
  export = content;
}

declare module '*.png' {
  const content: string;
  export = content;
}

interface AddressUtxoResult {
  legacyAddress: string;
  cashAddress: string;
  scriptPubKey: string;
  utxos: Utxo[];
}

interface Utxo {
  txid: string;
  vout: number;
  amount: number;
  satoshis: number;
  height: number;
  confirmations: number;
}

type ScriptName =
  | 'CHECK_TICKETS'
  | 'CREATE_CSV'
  | 'CREATE_TICKETS'
  | 'FUND_MOTHERSHIP'
  | 'FUND_TICKETS'
  | 'GENERATE_STATE'
  | 'GENERATE_WALLETS'
  | 'RECLAIM_FUNDS';

type Locale = 'en' | 'zh' | 'ko' | 'zh' | 'zhHans' | 'es' | 'fr' | 'it';

interface Settings {
  defaultLocale: string;
  debug: boolean;
  outDir: string;
  templateDir: string;
  hdpath: string;
  timer: number;
  defaultTickets: number;
  languages: {
    [any: string]: string;
  };
}

interface Mothership {
  fullNodePath: string;
  address: string;
  mnemonic: string;
  hdpath: string;
}

interface Campaign {
  title: string;
  mothership: Mothership;
  tickets: Tickets;
  template: Template;
}

interface Tickets {
  count: number;
  spread: {
    [number: string]: number;
  };
}

interface Template {
  pdf: PDF;
  qrcode: QRCode;
  csv: CSV;
}

interface QRCode {
  height: string;
  left: string;
  top: string;
}

interface PDF {
  height: string;
  width: string;
}

interface CSV {
  cashAddress: string;
  wif: string;
  claimed: boolean;
  value?: number;
}
