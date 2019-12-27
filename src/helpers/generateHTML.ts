import QRCode from 'qrcode';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from './colorFormatters';
import defaultTemplate from '../../templates/default';
import { getLocales } from '../i18n';
import getSettings from './getSettings';
import sleep from './sleep';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';

const logger = getLogger('generateHTML');
const settings = getSettings();
const { TITLES, QUESTIONS, INFO } = getLocales(settings.locale);

const displayInfo = ({
  title,
  filename,
}: {
  title: string;
  filename: string;
}): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_HTML,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_HTML,
      value: filename,
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
      const address = getCashAddress(wif).replace(/bitcoincash:/, '');
      const filename = `${address}.html`;

      QRCode.toDataURL(
        wif,
        { margin: 0 },
        (_err: Error, wifQR: string): void => {
          fs.writeFileSync(
            `${path}${filename}`,
            defaultTemplate(campaignData, wifQR),
          );
        },
      );

      displayInfo({ title, filename });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generateHTML;
