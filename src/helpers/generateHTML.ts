import QRCode from 'qrcode';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import defaultTemplate from '../../templates/default';
import getSettings from './getSettings';
import sleep from './sleep';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';
import logGenerateHTML from '../logger/logGenerateHTML';

const logger = getLogger('generateHTML');
const settings = getSettings();
/**
 * Generates HTML files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generateHTML = async (campaignData: Campaign): Promise<void> => {
  try {
    const { title } = campaignData;
    const wifs = getWIFS(campaignData.title);

    const path = `${settings.outDir}/${title}/html/`;

    fs.ensureDirSync(path);

    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      const wif = wifs[i];
      const address = getCashAddress(wif).replace(/:/, '_');
      const filename = `${address}.html`;

      QRCode.toDataURL(
        wif,
        { margin: 2 },
        (_err: Error, wifQR: string): void => {
          fs.writeFileSync(
            `${path}${filename}`,
            defaultTemplate(campaignData, wifQR),
          );
        },
      );

      logGenerateHTML({ title, filename });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateHTML;
