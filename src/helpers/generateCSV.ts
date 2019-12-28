import fs from 'fs-extra';
import { json2csvAsync } from 'json-2-csv';
import { getLogger } from 'log4js';

import getSettings from './getSettings';
import getCashAddress from './getCashAddress';
import sleep from './sleep';
import getWIFS from './getWIFs';
import logGenerateCSV from '../logger/logGenerateCSV';

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const generateCSV = async (campaignData: Campaign): Promise<void> => {
  const logger = getLogger();
  const settings = getSettings();

  try {
    const {
      title,
      tickets: { spread },
    } = campaignData;
    const wifs = getWIFS(campaignData.title);
    const filename = `${settings.outDir}/${title}/campaign.csv`;

    const addresses = [];
    let lastValue = 1;
    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      lastValue = spread[i] || lastValue;
      const wif = wifs[i];
      const claimed = false;
      const cashAddress = getCashAddress(wif);
      const value = lastValue;
      const obj: CSV = {
        cashAddress,
        wif,
        claimed,
        value,
      };
      addresses.push(obj);
      logGenerateCSV({ title, address: cashAddress });
    }

    const csv = await json2csvAsync(addresses);

    fs.writeFileSync(filename, csv);
    fs.writeFileSync(
      `${settings.outDir}/${title}/campaign.json`,
      JSON.stringify(addresses),
    );
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateCSV;
