import fs from 'fs-extra';
import { json2csvAsync } from 'json-2-csv';
import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from './colorFormatters';

import { getLocales } from '../i18n';
import getSettings from './getSettings';
import getCashAddress from './getCashAddress';
import getTieredValue from './getTieredValue';
import sleep from './sleep';
import getWIFS from './getWIFs';

const logger = getLogger();
const settings = getSettings();
const { TITLES, INFO, QUESTIONS } = getLocales(settings.locale);

const displayInfo = ({
  title,
  address,
}: {
  title: string;
  address: string;
}): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_CSV,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_CSV,
      value: address,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: QUESTIONS.WAIT,
      style: OutputStyles.Question,
    }),
  );
};

/**
 * Open the wallet generated with generate-wallet.
 *
 * @returns {Promise<any>}
 */
const generateCSV = async (campaignData: Campaign): Promise<void> => {
  try {
    const { title } = campaignData;
    const wifs = getWIFS(campaignData.title);
    const filename = `${settings.outDir}/${title}/campaign.csv`;

    const addresses = [];
    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      const wif = wifs[i];
      const claimed = false;
      const cashAddress = getCashAddress(wif);
      const value = getTieredValue(i, {});
      const obj: CSV = {
        cashAddress,
        wif,
        claimed,
        value,
      };
      addresses.push(obj);
      displayInfo({ title, address: cashAddress });
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
