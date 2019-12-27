import { HDNode } from 'bitcoincashjs-lib';
import { HDNode as BBHDNode, Mnemonic } from 'bitbox-sdk';

import fs from 'fs-extra';
import { getLogger } from 'log4js';
import { getLocales } from '../i18n';
import { colorOutput, OutputStyles } from './colorFormatters';
import sleep from './sleep';
import getSettings from './getSettings';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO, QUESTIONS } = getLocales(settings.locale);

const displayInfo = ({ wif }: { wif: string }): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_WIFS,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );
  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_WIFS,
      value: wif,
      lineabreak: true,
    }),
  );
  logger.info(
    colorOutput({
      item: QUESTIONS.WAIT,
      style: OutputStyles.Question,
    }),
  );
};
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
      displayInfo({ wif });
    }

    const privKeyWifs = `${settings.outDir}/${title}/privKeyWIFs`;

    fs.writeFileSync(privKeyWifs, wifs.join('\n'));
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateWIFs;
