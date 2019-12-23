import fs from "fs-extra";
import { getLogger } from "log4js";
import printGeneratedWallet from "./printGeneratedWallet";
import { MnemonicObject } from "../interfaces";

const logger = getLogger("writeFile");

/**
 * Sets up directory and creates wallet.json file
 *
 * @param {string} filename filename/path to write to
 * @param {MnemonicObject} data the mnemonic data object
 * @param {Callback} callback callback
 */
const writeFile = async (
  filename: string,
  data: MnemonicObject
): Promise<void> => {
  try {
    logger.debug("generateWallet::writeFile");
    fs.outputFileSync(filename, JSON.stringify(data));
    const rawFile = fs.readFileSync(filename, "utf8");
    const jsonData = JSON.parse(rawFile);

    printGeneratedWallet({ data: { ...jsonData, filename } });
  } catch (error) {
    printGeneratedWallet({ error });
  }
};
export default writeFile;
