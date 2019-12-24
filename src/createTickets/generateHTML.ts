import fs from 'fs-extra';
import QRCode from 'qrcode';
import { getLogger } from 'log4js';
import { sleep, colorOutput, OutputStyles } from '../helpers';
import defaultTemplate from '../../templates/default';
import settings from '../../settings.json';
import { getLocales } from '../i18n';

const logger = getLogger('generateHTML');
const strings = getLocales(settings.locale);

/**
 * Generates HTML files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generateHTML = async (
  wifs: string[],
  campaignData: Campaign,
): Promise<void> => {
  try {
    const { title } = campaignData;

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_HTML,
        value: title,
        style: OutputStyles.Start,
      }),
    );

    wifs.forEach(async (wif: string) => {
      await sleep(settings.timer);

      const filename = `${settings.outDir}/${title}/html/${wif}.html`;
      QRCode.toDataURL(
        wif,
        { margin: 0 },
        (_err: Error, wifQR: string): Promise<void> =>
          fs.writeFile(filename, defaultTemplate(campaignData, wifQR)),
      );
      logger.info(
        colorOutput({
          item: strings.CREATE_TICKETS.INFO_GENERATED_HTML,
          value: filename,
        }),
      );
    });

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_HTML_COMPLETE,
        value: title,
        style: OutputStyles.Complete,
      }),
    );
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default generateHTML;
