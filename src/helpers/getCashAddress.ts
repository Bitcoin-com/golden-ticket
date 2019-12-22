import { ECPair } from "bitbox-sdk";

/**
 * Returns cash address for supplied wif
 *
 * @param {string} wif
 * @returns {string}
 */
const getCashAddress = (wif: string): string => {
  const ecpair = new ECPair();
  const keypair = ecpair.fromWIF(wif);
  return ecpair.toCashAddress(keypair);
};

export default getCashAddress;
