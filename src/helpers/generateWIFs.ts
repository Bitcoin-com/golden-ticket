import { HDNode } from 'bitcoincashjs-lib';
import { HDNode as BBHDNode, Mnemonic } from 'bitbox-sdk';

import fs from 'fs-extra';
import { getLogger } from 'log4js';
import sleep from './sleep';
import getSettings from './getSettings';
import logGenerateWIFs from '../logger/logGenerateWIFs';

/**
 * Generates, saves and returns wifs
 *
 * @param {Campaign} {
 *   mothership: { mnemonic, hdpath },
 *   tickets,
 *   title,
 * }
 * @returns {Promise<void>}
 */
const generateWIFs = async ({
  mothership: { mnemonic, hdpath },
  tickets,
  title,
}: Campaign): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();
  try {
    const bbMnemonic = new Mnemonic();
    const hdnode = new BBHDNode();
    const rootSeed: Buffer = bbMnemonic.toSeed(mnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const bip44: HDNode = hdnode.derivePath(masterHDNode, hdpath);
    const wifs = [];

    for (let i = 0; i < tickets.count; i++) {
      await sleep(settings.timer);
      const node: HDNode = hdnode.derivePath(bip44, `0/0/${i}`);

      const wif = hdnode.toWIF(node);
      wifs.push(wif);
      logGenerateWIFs({ wif });
    }

    const privKeyWifs = `${settings.outDir}/${title}/privKeyWIFs`;

    fs.writeFileSync(privKeyWifs, wifs.join('\n'));
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateWIFs;
