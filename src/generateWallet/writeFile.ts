import fs from "fs-extra";
import { Mothership } from "./generateMothership";
import { SectionStrings } from "../i18n";
import printGeneratedWallet from "./printGeneratedWallet";

interface MnemonicObject {
  mnemonic: string;
  hdpath: string;
  mothership: Mothership;
}

type Callback = (res: { err?: object; filename?: string }) => void;

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
    await fs.outputFile(filename, JSON.stringify(data));
    const rawFile = await fs.readFile(filename, "utf8");
    const jsonData = await JSON.parse(rawFile);

    /* await fs.writeJSON(filename, data); */
    printGeneratedWallet({ data: { ...jsonData, filename }, strings });
  } catch (error) {
    printGeneratedWallet({ error, strings });
  }
};
export default writeFile;
