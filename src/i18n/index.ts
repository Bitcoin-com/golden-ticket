import enStrings from "./en.json";

export type ScriptName =
  | "check-tickets"
  | "create-csv"
  | "create-tickets"
  | "fund-mothership"
  | "fund-tickets"
  | "generate-state"
  | "GENERATE_WALLETS"
  | "reclaim-funds";

export type SectionStrings = typeof enStrings["GENERATE_WALLETS"];

export const locales = {
  en: enStrings,
  ja: enStrings,
  ko: enStrings,
  zh: enStrings,
  zhHast: enStrings,
  es: enStrings,
  fr: enStrings,
  it: enStrings
};

export type Locale = keyof typeof locales;
