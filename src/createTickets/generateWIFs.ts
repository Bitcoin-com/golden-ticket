import { HDNode } from 'bitcoincashjs-lib';
import { HDNode as BBHDNode, Mnemonic } from 'bitbox-sdk';

import fs from 'fs-extra';
import { getLogger } from 'log4js';
import { getLocales } from '../i18n';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import sleep from '../helpers/sleep';
import settings from '../../settings.json';

const logger = getLogger('generateWallets');
const strings = getLocales(settings.locale);

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
  mothership: { mnemonic, hdpath },
  tickets,
  title,
}: Campaign): Promise<string[]> => {
  try {
    const bbMnemonic = new Mnemonic();
    const hdnode = new BBHDNode();
    const rootSeed: Buffer = bbMnemonic.toSeed(mnemonic);
    const masterHDNode: HDNode = hdnode.fromSeed(rootSeed);
    const bip44: HDNode = hdnode.derivePath(masterHDNode, hdpath);
    const wifs = [];

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_WIFS,
        value: title,
        style: OutputStyles.Start,
      }),
    );

    for (let i = 0; i < tickets.count; i++) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(settings.timer);
      const node: HDNode = hdnode.derivePath(bip44, `0/0/${i}`);

      const wif = hdnode.toWIF(node);
      wifs.push(wif);
      logger.info(
        colorOutput({
          item: strings.CREATE_TICKETS.INFO_GENERATED_WIF,
          value: wif,
        }),
      );
    }

    const privKeyWifs = `${settings.outDir}/${title}/privKeyWIFs`;

    fs.writeFileSync(privKeyWifs, wifs.join('\n'));
    fs.ensureFileSync(privKeyWifs);

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATED_WIFS,
        value: privKeyWifs,
        style: OutputStyles.Complete,
      }),
    );

    return wifs;
  } catch (error) {
    return error;
  }
};

export default generateWIFs;
