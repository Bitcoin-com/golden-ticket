import { HDNode as BitboxHDNode, Mnemonic } from 'bitbox-sdk';
import { HDNode } from 'bitcoincashjs-lib';
import { getLogger } from 'log4js';

import { getLanguage } from '../i18n';

import createMnemonic from './createMnemonic';

import getSettings from '../helpers/getSettings';

/**
 * Generate mothership wallet
 *
 * @param {string} mnemonic Mnemonic to use to generate wallet
 * @param {string} hdpath hdpath to generate HDNode with
 * @returns {Mothership} Object full mothership derivation path and cashaddr
 */
const createMothership = async (
  hdpath: string,
  master?: Campaign,
  account?: number,
): Promise<Mothership | null> => {
  const logger = getLogger();
  const settings = getSettings();

  try {
    // asks user to enter mnemonic or eneter their own
    const mnemonic = await createMnemonic(getLanguage(settings.locale), master);
    if (!mnemonic) return null;

    // initialize bitbox classes
    const bbMnemonic = new Mnemonic();
    const bbHdnode = new BitboxHDNode();

    // create master HD Node from mnemonic
    const masterSeedBuffer: Buffer = bbMnemonic.toSeed(mnemonic); // master HDNode seed buffer
    const masterHdnode: HDNode = bbHdnode.fromSeed(masterSeedBuffer); // master HDNode

    // create first HD Node
    const firstPath = `${hdpath}/${account || 0}'`; // derivation path for first BIP44 account
    const firstHdnode: HDNode = bbHdnode.derivePath(masterHdnode, firstPath); // HDNode of first BIP44 account

    // create mothership HD Node
    const motherPath = '1/0'; // derivation path for mothership HDNode
    const motherHdNode: HDNode = bbHdnode.derivePath(firstHdnode, motherPath); // mothership HDNode

    // get mothership address, wif and fullnode path
    const address: string = bbHdnode.toCashAddress(motherHdNode); // bch cashaddr
    const fullNodePath = `${hdpath}/${account || 0}/${motherPath}`; // full hdnode path
    const wif: string = bbHdnode.toWIF(motherHdNode);

    return {
      fullNodePath,
      address,
      mnemonic,
      hdpath,
      wif,
    };
  } catch (error) {
    throw logger.error(error);
  }
};

export default createMothership;
