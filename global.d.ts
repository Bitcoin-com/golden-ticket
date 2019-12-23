// Type definitions for Golden Ticket v3.0
// Project: golden-ticket
// Definitions by: Paul Bergamo <paul@bitcoin.com>

declare module 'to-regex-range';
declare module 'qrcode-terminal';
/**
 * Declare
 */

declare module '*.txt' {
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
