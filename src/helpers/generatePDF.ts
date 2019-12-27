import path from 'path';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import pdf from 'html-pdf';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from './colorFormatters';

import { getLocales } from '../i18n';
import getTemplates from './getTemplates';
import getSettings from '../getSettings';
import sleep from './sleep';

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
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generatePDF = async (
  wifs: string[],
  campaignData: Campaign,
): Promise<void> => {
  try {
    const { title, template } = campaignData;
    const baseDir = `${settings.outDir}/${title}/`;
    fs.ensureDirSync(`${baseDir}pdf/`);

    for (let i = 0; i < wifs.length; i++) {
      await sleep(settings.timer);
      const wif = wifs[i];
      const filename = `${baseDir}pdf/${wif}.pdf`;

      displayInfo({ title, filename: `${wif}.pdf` });

      // get html file
      const privKeyWIFsHtml: string = fs.readFileSync(
        path.resolve(process.cwd(), `${baseDir}html/${wif}.html`),
        'utf8',
      );

      const { pdf: pdfSettings } = getTemplates()[template];

      pdf
        .create(privKeyWIFsHtml, {
          ...pdfSettings,
          base: path.resolve(process.cwd()),
          script: path.resolve(
            'node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js',
          ),
          phantomPath: path.resolve(
            'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs.exe',
          ),
        })
        .toFile(path.resolve(filename));
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generatePDF;
