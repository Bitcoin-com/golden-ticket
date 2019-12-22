import fs from "fs-extra";
import { Mnemonic, HDNode as BB_HDNode } from "bitbox-sdk";
import { HDNode } from "bitcoincashjs-lib";
import { emoji } from "node-emoji";
import { Campaign } from "../interfaces";
import { getLogger, sleep, generateConfig, colorOutput } from "../helpers";
import settings from "../settings.json";

const logger = getLogger("generateWallets");

/**
 * Generates, saves and returns wifs
 *
 * @param {Campaign} {
 *   mnemonic,
 *   hdpath,
 *   ticketCount,
 *   title
 * }
 * @returns {Promise<string[]>}
 */
const generateWIFs = async ({
  mnemonic,
  hdpath,
  ticketCount,
  title
}: Campaign): Promise<string[]> => {
  try {
    const {
      strings: { INFO_GENERATED_WIF, INFO_GENERATING_WIFS, INFO_GENERATED_WIFS }
    } = generateConfig("CREATE_TICKETS");
    const bbMnemonic = new Mnemonic();
    const hdnode = new BB_HDNode();
    const rootSeed: Buffer = bbMnemonic.toSeed(mnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const bip44: HDNode = hdnode.derivePath(masterHDNode, hdpath);
    const wifs = [];

    logger.info(
      `${emoji.hourglass_flowing_sand} ${INFO_GENERATING_WIFS}`,
      title
    );

    for (let i: number = 0; i < ticketCount; i++) {
      await sleep(settings.timer);
      const node: HDNode = hdnode.derivePath(bip44, `0/0/${i}`);

      const wif = hdnode.toWIF(node);
      wifs.push(wif);
      logger.info(colorOutput(INFO_GENERATED_WIF, wif));
    }

    const privKeyWifs = `${settings.outDir}/${title}/privKeyWIFs`;

    fs.writeFileSync(privKeyWifs, wifs.join("\n"));
    fs.ensureFileSync(privKeyWifs);

    logger.info(
      `${emoji.white_check_mark}  ${INFO_GENERATED_WIFS}`,
      privKeyWifs
    );

    return wifs;
  } catch (error) {
    return error;
  }
};

export default generateWIFs;
