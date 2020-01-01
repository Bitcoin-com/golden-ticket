import QRCode from 'qrcode';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import getSettings from './getSettings';
import sleep from './sleep';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';
import logGenerateHTML from '../logger/logGenerateHTML';
import getTemplates from './getTemplates';

const logger = getLogger('generateHTML');
const settings = getSettings();
/**
 * Generates HTML files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generateQR = async (campaignData: Campaign): Promise<void> => {
  try {
    const { title, template } = campaignData;
    const wifs = getWIFS(title);

    const path = `${settings.outDir}/${title}/qr/`;

    fs.ensureDirSync(path);

    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      const wif = wifs[i];
      const address = getCashAddress(wif).replace(/:/, '_');
      const filename = `${path}/${address}.png`;
      const { qrcode } = getTemplates()[template];

      QRCode.toFile(filename, wif, qrcode);

      logGenerateHTML({ title, filename });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateQR;
