import enStrings from './en.json';

type Locales = {
  +readonly [K in keyof typeof enStrings]: typeof enStrings[K];
};

const locales: {
  [key: string]: Locales;
} = {
  en: enStrings,
  ja: enStrings,
  ko: enStrings,
  zh: enStrings,
  'zh-Hans': enStrings,
  es: enStrings,
  fr: enStrings,
  it: enStrings,
};

const languageMap: {
  [key: string]: string;
} = {
  en: 'english',
  ja: 'japanese',
  'zh-Hans': 'chinese_simplified',
  zh: 'chinese_traditional',
  fr: 'french',
  it: 'italian',
  ko: 'korean',
  es: 'spanish',
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
      ...locales[locale as Locale],
    };

  return locales.en;
};

/**
 * Returns mnemonic friendly language
 *
 * @param {Locale} locale
 * @returns {string}
 */
export const getLanguage = (locale: Locale): string => {
  return languageMap[locale];
};
