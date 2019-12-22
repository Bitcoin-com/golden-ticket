import { Address } from "bitbox-sdk";
import { AddressUtxoResult } from "bitcoin-com-rest";

/**
 * Get utxos from single address
 *
 * @param {string[]} mothershipAddress
 * @returns {(Promise<AddressUtxoResult | AddressUtxoResult[]>)}
 */
const getUTXOs = async (
  mothershipAddress: string
): Promise<AddressUtxoResult | AddressUtxoResult[]> => {
  try {
    const address = new Address();
    const utxos = await address.utxo(mothershipAddress);

    return utxos;
  } catch (error) {
    return error;
  }
};

export default getUTXOs;
