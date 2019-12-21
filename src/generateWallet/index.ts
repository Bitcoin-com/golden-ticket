import getUserInput from "./getUserInput";
import generateMnemonic from "./generateMnemonic";
import generateMothership from "./generateMothership";
import writeFile from "./writeFile";

import generateConfig from "../helpers/generateConfig";
import { GenerateWalletUserInput, Config, Mothership } from "../interfaces";
import { getLogger } from "log4js";

const logger = getLogger("generateWallet");
/**
 * Generate Wallets
 */
const main = (): void => {
  logger.debug("generateWallet::main()");
  // get settings from generated config
  const { hdpath, strings, outDir }: Config = generateConfig(
    "GENERATE_WALLETS"
  );

  // get input from user
  const { title }: GenerateWalletUserInput = getUserInput(strings);

  // genereate a mnemonic
  const mnemonic: string = generateMnemonic();

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
  writeFile(filename, fileData, strings);
};

export default main();
