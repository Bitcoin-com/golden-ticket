import { Mnemonic, HDNode as BitboxHDNode } from "bitbox-sdk";
import { HDNode } from "bitcoincashjs-lib";
import { getLogger } from "../helpers";
import { Mothership } from "../interfaces";

const logger = getLogger("generateMothership");
/**
 * Generate mothership wallet
 *
 * @param {string} seed Mnemonic to use to generate wallet
 * @param {string} path hdpath to generate HDNode with
 * @returns {Mothership} Object full mothership derivation path and cashaddr
 */
const generateMothership = (seed: string, path: string): Mothership => {
  logger.debug("generateWallet::generateMothership");

  const mnemonic = new Mnemonic();
  const hdnode = new BitboxHDNode();

  const masterSeedBuffer: Buffer = mnemonic.toSeed(seed); // master HDNode seed buffer
  const masterHdnode: HDNode = hdnode.fromSeed(masterSeedBuffer); // master HDNode

  const firstPath: string = `${path}/0'`; // derivation path for first BIP44 account
  const firstHdnode: HDNode = hdnode.derivePath(masterHdnode, firstPath); // HDNode of first BIP44 account

  const motherPath: string = "1/0"; // derivation path for mothership HDNode
  const motherHdNode: HDNode = hdnode.derivePath(firstHdnode, motherPath); // mothership HDNode

  const address: string = hdnode.toCashAddress(motherHdNode); // bch cashaddr
  const fullNodePath: string = `${path}/0/1/0`; // full hdnode path

  return { fullNodePath, address };
};

export default generateMothership;
