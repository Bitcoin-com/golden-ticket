import path from 'path';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import pdf from 'html-pdf';
import { OutputStyles, colorOutput } from './colorFormatters';

import { getLocales } from '../i18n';
import getTemplates from './getTemplates';
import getSettings from './getSettings';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';

const logger = getLogger('generatePDF');
const settings = getSettings();
const { INFO, TITLES, QUESTIONS } = getLocales(settings.locale);

const displayInfo = ({
  title,
  filename,
}: {
  title: string;
  filename: string;
}): void => {
  logger.info(
    colorOutput({
      item: TITLES.CAMPAIGN_PDF,
      value: title,
      style: OutputStyles.Title,
      lineabreak: true,
    }),
  );

  logger.info(
    colorOutput({
      item: INFO.CAMPAIGN_PDF,
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
 * Generates and saves PDF Files
 *
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generatePDF = async (campaignData: Campaign): Promise<void> => {
  try {
    const { title, template } = campaignData;
    const baseDir = `${settings.outDir}/${title}`;
    const wifs = getWIFS(campaignData.title);

    fs.ensureDirSync(`${baseDir}/pdf/`);

    for (let i = 0; i < wifs.length; i++) {
      const wif = wifs[i];
      const address = getCashAddress(wif).replace(/bitcoincash:/, '');
      const filename = `${address}.pdf`;
      const pdfPath = `${baseDir}/pdf/${filename}`;

      const htmlPath = path.resolve(
        process.cwd(),
        `${baseDir}/html/${wif}.html`,
      );

      displayInfo({ title, filename });

      // get html file
      const privKeyWIFsHtml: string = fs.readFileSync(htmlPath, 'utf8');

      const pdfOptions = {
        ...getTemplates()[template].pdf,
        base: path.resolve(process.cwd()),
        script: path.resolve(
          'node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js',
        ),
        phantomPath: path.resolve(
          'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe',
        ),
      };

      await new Promise((resolve, reject) => {
        const create = pdf.create(privKeyWIFsHtml, pdfOptions);
        create.toFile(pdfPath, (err: Error): void => {
          if (err) reject(err);
          resolve();
        });
      });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generatePDF;
