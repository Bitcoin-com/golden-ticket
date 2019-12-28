/* eslint-disable prefer-destructuring */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Address = require('bitbox-sdk').Address;

/**
 * Get utxos from single address
 *
 * @param {string[]} mothershipAddress
 * @returns {(Promise<AddressUtxoResult | AddressUtxoResult[]>)}
 */
const getUTXOs = async (
  mothershipAddress: string | string[],
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
