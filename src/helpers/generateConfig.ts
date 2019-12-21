import { locales } from "../i18n";
import settings from "../settings.json";
import { Config, ScriptName } from "../interfaces";
import logger from "./logger";

/**
 * Generates localized config settings
 *
 * @param {{
 *   locale: Locale;
 *   scriptName: ScriptName;
 * }} props
 * @returns {Config}
 */
const generateConfig = (scriptName: ScriptName): Config => {
  logger.debug("generateWallet::generateConfig");
  const scripts = locales[settings.defaultLocale];
  const strings = scripts[scriptName];

  return {
    outDir: settings.outDir,
    hdpath: settings.hdpath,
    strings
  };
};

export default generateConfig;
