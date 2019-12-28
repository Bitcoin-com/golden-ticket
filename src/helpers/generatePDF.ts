import path from 'path';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import pdf from 'html-pdf';
import getTemplates from './getTemplates';
import getSettings from './getSettings';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';
import logGeneratePDF from '../logger/logGeneratePDF';

/**
 * Generates and saves PDF Files
 *
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generatePDF = async (campaignData: Campaign): Promise<void> => {
  const logger = getLogger('generatePDF');
  const settings = getSettings();

  try {
    const { title, template } = campaignData;
    const baseDir = `${settings.outDir}/${title}`;
    const wifs = getWIFS(campaignData.title);

    fs.ensureDirSync(`${baseDir}/pdf/`);

    for (let i = 0; i < wifs.length; i++) {
      const wif = wifs[i];
      const address = getCashAddress(wif).replace(/:/, '_');
      const filename = `${address}.pdf`;
      const pdfPath = `${baseDir}/pdf/${filename}`;

      const htmlPath = path.resolve(
        process.cwd(),
        `${baseDir}/html/${address}.html`,
      );

      logGeneratePDF({ title, filename });

      // get html file
      const privKeyWIFsHtml: string = fs
        .readFileSync(htmlPath, 'utf8')
        .toString();

      const pdfOptions = {
        ...getTemplates()[template].pdf,
        script: path.resolve(
          'node_modules/html-pdf/lib/scripts/pdf_a4_portrait.js',
        ),
        phantomPath: path.resolve(
          'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
        ),
      };

      await new Promise((resolve, reject) => {
        const create = pdf.create(privKeyWIFsHtml, pdfOptions);
        create.toFile(pdfPath, (err: Error): void => {
          if (err) throw reject(err);
          resolve();
        });
      });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generatePDF;
