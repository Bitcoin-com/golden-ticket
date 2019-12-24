import { Mnemonic, HDNode as BitboxHDNode } from 'bitbox-sdk';
import { HDNode } from 'bitcoincashjs-lib';
import { getLogger } from 'log4js';
import generateMnemonic from './createMnemonic';
import { getLanguage } from '../i18n';
import settings from '../../settings.json';

/**
 * Generate mothership wallet
 *
 * @param {string} mnemonic Mnemonic to use to generate wallet
 * @param {string} hdpath hdpath to generate HDNode with
 * @returns {Mothership} Object full mothership derivation path and cashaddr
 */
const createMothership = async (hdpath: string): Promise<Mothership | null> => {
  const logger = getLogger('createMothership');
  logger.debug('createMothership');

  try {
    // asks user to enter mnemonic or eneter their own
    const mnemonic = await generateMnemonic(
      getLanguage(settings.locale as Locale),
    );
    if (!mnemonic) return null;

    const bbMnemonic = new Mnemonic();
    const hdnode = new BitboxHDNode();

    const masterSeedBuffer: Buffer = bbMnemonic.toSeed(mnemonic); // master HDNode seed buffer
    const masterHdnode: HDNode = hdnode.fromSeed(masterSeedBuffer); // master HDNode

    const firstPath = `${hdpath}/0'`; // derivation path for first BIP44 account
    const firstHdnode: HDNode = hdnode.derivePath(masterHdnode, firstPath); // HDNode of first BIP44 account

    const motherPath = '1/0'; // derivation path for mothership HDNode
    const motherHdNode: HDNode = hdnode.derivePath(firstHdnode, motherPath); // mothership HDNode

    const address: string = hdnode.toCashAddress(motherHdNode); // bch cashaddr
    const fullNodePath = `${hdpath}/0/1/0`; // full hdnode path

    return { fullNodePath, address, mnemonic, hdpath };
  } catch (error) {
    throw logger.error(error);
  }
};

export default createMothership;
