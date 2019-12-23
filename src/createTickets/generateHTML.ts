import fs from 'fs-extra';
import QRCode from 'qrcode';
import { getLogger } from 'log4js';
import { sleep, colorOutput, OutputStyles } from '../helpers';
import { Campaign } from '../interfaces';
import defaultTemplate from '../templates/default';
import settings from '../../settings.json';
import { locales } from '../i18n';

const logger = getLogger('generateHTML');

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
    const strings = locales[settings.defaultLocale];

    const { title } = campaignData;

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_HTML,
        value: title,
        style: OutputStyles.Start,
      }),
    );

    wifs.forEach(async wif => {
      await sleep(settings.timer);
      const filename = `${settings.outDir}/${title}/html/${wifs[wif]}.html`;
      QRCode.toDataURL(
        wifs[wif],
        { margin: 0 },
        (_err: Error, wifQR: string): Promise<void> =>
          fs.writeFile(filename, defaultTemplate(campaignData, wifQR)),
      );
      logger.info(
        colorOutput({ item: strings.INFO_GENERATED_HTML, value: filename }),
      );
    });

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_HTML_COMPLETE,
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
