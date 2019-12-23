import { locales } from "../i18n";
import en from "../i18n/en.json";
import { Locale } from "../interfaces";

export type Locales = {
  +readonly [K in keyof typeof en]: typeof en[K];
};

/**
 * Returns localized strings
 *
 * @param {string} locale
 * @returns {Locales}
 */
const getLocales = (locale: Locale): Locales => ({
  ...locales.en,
  ...locales[locale]
});

export default getLocales;
