import { locales, Locale, ScriptName, SectionStrings } from "../i18n";
import settings from "../settings.json";
import logger from "./logger";

export interface Config {
  locale: Locale;
  outDir: string;
  hdpath: string;
  strings: SectionStrings;
}

/**
 * Generates localized config settings
 *
 * @param {{
 *   locale: Locale;
 *   scriptName: ScriptName;
 * }} props
 * @returns {Config}
 */
const generateConfig = (props: {
  locale: Locale;
  scriptName: ScriptName;
}): Config => {
  const { locale, scriptName } = props;
  const scripts = locales[locale];

  const strings = scripts[scriptName];

  return {
    locale: settings.defaultLocale as Locale,
    outDir: settings.outDir,
    hdpath: settings.hdpath,
    strings
  };
};

export default generateConfig;
