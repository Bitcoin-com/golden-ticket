import fs from "fs-extra";
import { json2csvAsync } from "json-2-csv";
import { CSV } from "../interfaces";

/**
 * Writes out csv file
 *
 * @param {string} filename
 * @param {CSV[]} addresses
 * @returns {Promise<void>}
 */
const writeCSV = async (filename: string, addresses: CSV[]): Promise<void> => {
  try {
    const csv = await json2csvAsync(addresses);

    fs.writeFileSync(filename, csv);
  } catch (error) {
    return error;
  }
};

export default writeCSV;
