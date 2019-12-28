import { HDNode as BitboxHDNode, Mnemonic } from 'bitbox-sdk';
import { HDNode } from 'bitcoincashjs-lib';
import { getLogger } from 'log4js';
import createMnemonic from './createMnemonic';
import { getLanguage } from '../i18n';
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
  logger.debug(master);
  try {
    // asks user to enter mnemonic or eneter their own
    const mnemonic = await createMnemonic(getLanguage(settings.locale), master);
    if (!mnemonic) return null;

    const bbMnemonic = new Mnemonic();
    const bbHdnode = new BitboxHDNode();

    const masterSeedBuffer: Buffer = bbMnemonic.toSeed(mnemonic); // master HDNode seed buffer
    const masterHdnode: HDNode = bbHdnode.fromSeed(masterSeedBuffer); // master HDNode

    const firstPath = `${hdpath}/${account || 0}'`; // derivation path for first BIP44 account
    const firstHdnode: HDNode = bbHdnode.derivePath(masterHdnode, firstPath); // HDNode of first BIP44 account

    const motherPath = '1/0'; // derivation path for mothership HDNode
    const motherHdNode: HDNode = bbHdnode.derivePath(firstHdnode, motherPath); // mothership HDNode

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
