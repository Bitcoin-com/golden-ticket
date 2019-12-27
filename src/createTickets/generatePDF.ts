import fs from 'fs-extra';
import { getLogger } from 'log4js';
import pdf from 'html-pdf';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import { getLocales } from '../i18n';
import getTemplates from '../helpers/getTemplates';
import settings from '../../settings.json';

const logger = getLogger('generatePDF');
const strings = getLocales(settings.locale);

/**
 * Generates and saves PDF Files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generatePDF = (wifs: string[], campaignData: Campaign): void => {
  try {
    const { title, template } = campaignData;

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_PDF,
        value: title,
        style: OutputStyles.Start,
      }),
    );

    wifs.forEach((wif: string): void => {
      const htmlFilename = `${settings.outDir}/${title}/html/${wif}.html`;
      const pdfFilename = `${settings.outDir}/${title}/pdf/${wif}.pdf`;

      // get html file
      const privKeyWIFsHtml: string = fs.readFileSync(htmlFilename, 'utf8');

      pdf
        .create(privKeyWIFsHtml, getTemplates()[template].pdf)
        .toFile(pdfFilename);
      logger.info(
        colorOutput({
          item: strings.CREATE_TICKETS.INFO_GENERATED_PDF,
          value: pdfFilename,
        }),
      );
    });

    logger.info(
      colorOutput({
        item: strings.CREATE_TICKETS.INFO_GENERATING_PDF_COMPLETE,
        value: title,
        style: OutputStyles.Complete,
      }),
    );
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

export default generatePDF;
