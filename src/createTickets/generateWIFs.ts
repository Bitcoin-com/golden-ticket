import fs from "fs-extra";
import { Mnemonic, HDNode as BB_HDNode } from "bitbox-sdk";
import { HDNode } from "bitcoincashjs-lib";
import { Campaign } from "../interfaces";
import { getLogger, sleep, colorOutput, OutputStyles } from "../helpers";
import settings from "../settings.json";
import { locales } from "../i18n";

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
      CREATE_TICKETS: {
        INFO_GENERATED_WIF,
        INFO_GENERATING_WIFS,
        INFO_GENERATED_WIFS
      }
    } = locales[settings.defaultLocale];

    const bbMnemonic = new Mnemonic();
    const hdnode = new BB_HDNode();
    const rootSeed: Buffer = bbMnemonic.toSeed(mnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const bip44: HDNode = hdnode.derivePath(masterHDNode, hdpath);
    const wifs = [];

    logger.info(
      colorOutput({
        item: INFO_GENERATING_WIFS,
        value: title,
        style: OutputStyles.Start
      })
    );

    for (let i: number = 0; i < ticketCount; i++) {
      await sleep(settings.timer);
      const node: HDNode = hdnode.derivePath(bip44, `0/0/${i}`);

      const wif = hdnode.toWIF(node);
      wifs.push(wif);
      logger.info(colorOutput({ item: INFO_GENERATED_WIF, value: wif }));
    }

    const privKeyWifs = `${settings.outDir}/${title}/privKeyWIFs`;

    fs.writeFileSync(privKeyWifs, wifs.join("\n"));
    fs.ensureFileSync(privKeyWifs);

    logger.info(
      colorOutput({
        item: INFO_GENERATED_WIFS,
        value: privKeyWifs,
        style: OutputStyles.Complete
      })
    );

    return wifs;
  } catch (error) {
    return error;
  }
};

export default generateWIFs;
