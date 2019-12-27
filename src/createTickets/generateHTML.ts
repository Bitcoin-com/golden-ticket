import QRCode from 'qrcode';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';
import defaultTemplate from '../../templates/default';
import { getLocales } from '../i18n';
import getSettings from '../getSettings';

/**
 * Generates HTML files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generateHTML = (wifs: string[], campaignData: Campaign): void => {
  const logger = getLogger('generateHTML');
  const settings = getSettings();
  const strings = getLocales(settings.locale);
  try {
    const { title } = campaignData;

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_HTML,
        value: title,
        style: OutputStyles.Start,
      }),
    );

    wifs.forEach((wif: string): void => {
      const filename = `${settings.outDir}/${title}/html/${wif}.html`;
      QRCode.toDataURL(
        wif,
        { margin: 0 },
        (_err: Error, wifQR: string): void => {
          fs.writeFileSync(filename, defaultTemplate(campaignData, wifQR));
        },
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
