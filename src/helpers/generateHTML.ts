import QRCode from 'qrcode';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import defaultTemplate from '../../templates/default';
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
const generateHTML = async (campaignData: Campaign): Promise<void> => {
  try {
    const { title, template } = campaignData;
    const wifs = getWIFS(title);

    const { image, html } = getTemplates()[template];

    const baseTemplatePath = `${settings.templateDir}/${template}`;
    const baseCampaignPath = `${settings.outDir}/${title}`;

    const templateImagePath = `${baseTemplatePath}/${image}`;
    const templateImage = fs.readFileSync(templateImagePath).toString('base64');

    const templateHtmlPath = `${baseTemplatePath}/index.html`;

    const campaignHtmlPath = `${baseCampaignPath}/html/`;

    const baseQRPath = `${baseCampaignPath}/qr/`;

    fs.ensureDirSync(campaignHtmlPath);

    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      const wif = wifs[i];
      const address = getCashAddress(wif).replace(/:/, '_');
      const filename = `${address}.html`;

      const qrImage = fs
        .readFileSync(`${baseQRPath}/${address}.png`)
        .toString('base64');

      const htmlData = fs
        .readFileSync(templateHtmlPath)
        .toString()
        .replace(/{{title}}/, `${title} - ${address.replace(/_/, ':')}`)
        .replace(/{{qrcode}}/, `data:image/png;base64,${qrImage}`)
        .replace(/{{image}}/, `data:image/png;base64,${templateImage}`)
        .replace(/'{{width}}'/, html.width)
        .replace(/'{{height}}'/, html.height)
        .replace(/'{{top}}'/, html.qrTop)
        .replace(/'{{left}}'/, html.qrLeft)
        .replace(/'{{size}}'/, html.qrSize);

      fs.writeFileSync(`${campaignHtmlPath}/${address}.html`, htmlData);

      logGenerateHTML({ title, filename });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateHTML;
