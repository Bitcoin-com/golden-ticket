import fs from "fs-extra";
import printGeneratedWallet from "./printGeneratedWallet";
import { SectionStrings, MnemonicObject } from "../interfaces";
import logger from "../helpers/logger";

/**
 * Sets up directory and creates wallet.json file
 *
 * @param {string} filename filename/path to write to
 * @param {MnemonicObject} data the mnemonic data object
 * @param {Callback} callback callback
 */
const writeFile = async (
  filename: string,
  data: MnemonicObject,
  strings: SectionStrings
): Promise<void> => {
  try {
    logger.debug("generateWallet::writeFile");
    fs.outputFileSync(filename, JSON.stringify(data));
    const rawFile = fs.readFileSync(filename, "utf8");
    const jsonData = JSON.parse(rawFile);

    /* await fs.writeJSON(filename, data); */
    printGeneratedWallet({ data: { ...jsonData, filename }, strings });
  } catch (error) {
    printGeneratedWallet({ error, strings });
  }
};
export default writeFile;
