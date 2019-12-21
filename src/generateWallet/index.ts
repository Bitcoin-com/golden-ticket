import getUserInput, { UserInput } from "./getUserInput";
import generateMnemonic from "./generateMnemonic";
import generateMothership, { Mothership } from "./generateMothership";
import writeFile from "./writeFile";

import { Locale, locales } from "../i18n";
import generateConfig, { Config } from "../helpers/generateConfig";
import settings from "../settings.json";

/**
 * Generate Wallets
 */
const main = async (): Promise<void> => {
  const { argv } = process;

  let locale: Locale = Object.keys(locales).includes(argv[3])
    ? (argv[3] as Locale)
    : (settings.defaultLocale as Locale);

  // get settings from generated config
  const { hdpath, strings, outDir }: Config = generateConfig({
    locale,
    scriptName: "GENERATE_WALLETS"
  });

  // get input from user
  const { title, locale: settingsLocale }: UserInput = getUserInput(strings);

  // genereate a mnemonic
  const mnemonic: string = generateMnemonic(
    settings.languages[locale ? locale : settingsLocale]
  );

  // HDNode of first internal change address
  const mothership: Mothership = generateMothership(mnemonic, hdpath);

  // prepare for writting wallet to file
  const filename: string = `${outDir}/${title}/wallet.json`;
  const fileData = {
    mnemonic,
    hdpath,
    mothership
  };

  // write file and print results
  await writeFile(filename, fileData, strings);
};

export default main();
