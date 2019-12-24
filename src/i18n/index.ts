import enStrings from './en.json';

const locales = {
  en: enStrings,
  ja: enStrings,
  ko: enStrings,
  zh: enStrings,
  zhHans: enStrings,
  es: enStrings,
  fr: enStrings,
  it: enStrings,
};

export type Locales = {
  +readonly [K in keyof typeof enStrings]: typeof enStrings[K];
};

/**
 * Returns localized strings
 *
 * @param {string} locale
 * @returns {Locales}
 */
export const getLocales = (locale: string): Locales => {
  if (Object.keys(locales).includes(locale))
    return {
      ...locales.en,
      ...locales[locale],
    };

  return locales.en;
};
