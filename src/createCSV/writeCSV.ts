import fs from 'fs-extra';
import { json2csvAsync } from 'json-2-csv';
import { getLogger } from 'log4js';
import { CSV } from '../interfaces';

const logger = getLogger('createCSV');

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
    logger.error(error.message);
    throw error;
  }
};

export default writeCSV;
