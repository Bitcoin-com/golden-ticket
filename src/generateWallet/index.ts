import getUserInput from "./getUserInput";
import generateMnemonic from "./generateMnemonic";
import generateMothership from "./generateMothership";
import writeFile from "./writeFile";
import { GenerateWalletUserInput, Mothership } from "../interfaces";
import { locales } from "../i18n";
import { getLogger } from "../helpers";
import settings from "../settings.json";

const logger = getLogger("generateWallet");
/**
 * Generate Wallets
 */
const main = async (): Promise<void> => {
  try {
    logger.debug("generateWallet::main()");
    const strings = locales[settings.defaultLocale];

    // get input from user
    const { title }: GenerateWalletUserInput = await getUserInput();

    if (!title) return;
    // genereate a mnemonic
    const mnemonic: string = generateMnemonic();

    // HDNode of first internal change address
    const mothership: Mothership = generateMothership(
      mnemonic,
      settings.hdpath
    );

    // prepare for writting wallet to file
    const filename: string = `${settings.outDir}/${title}/wallet.json`;
    const fileData = {
      title,
      mnemonic,
      hdpath: settings.hdpath,
      mothership
    };

    // write file and print results
    await writeFile(filename, fileData);
  } catch (error) {
    throw error;
  }
};

export default main();
