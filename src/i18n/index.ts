import getSettings from '../helpers/getSettings';
import en from './en.json';

const settings = getSettings();

type Locales = {
  +readonly [K in keyof typeof en]: typeof en[K];
};

/**
 * Returns localized strings
 *
 * @param {string} locale
 * @returns {Locales}
 */
export const getLocales = (locale: string = settings.locale): Locales => {
  const locales: {
    [key: string]: Locales;
  } = {
    en,
    ja: en,
    ko: en,
    zh: en,
    'zh-Hans': en,
    es: en,
    fr: en,
    it: en,
  };

  if (Object.keys(locales).includes(locale))
    return {
      ...en,
      ...locales[locale],
    };

  return locales.en;
};

/**
 * Returns mnemonic friendly language
 *
 * @param {Locale} locale
 * @returns {string}
 */
export const getLanguage = (locale: string): string => {
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
  return languageMap[locale];
};
