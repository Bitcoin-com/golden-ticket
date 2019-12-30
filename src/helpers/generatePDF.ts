import path from 'path';
import fs from 'fs-extra';
import { getLogger } from 'log4js';
import PDFDocument from 'pdfkit';
/* import getTemplates from './getTemplates'; */
import getSettings from './getSettings';
import getWIFS from './getWIFs';
import getCashAddress from './getCashAddress';
import logGeneratePDF from '../logger/logGeneratePDF';
import getTemplates from './getTemplates';

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

      await new Promise((resolve, reject): void => {
        try {
          const { pdf, image } = getTemplates()[template];
          const doc = new PDFDocument({
            size: pdf.size,
            autoFirstPage: false,
          });

          const stream = fs.createWriteStream(pdfPath);
          stream.on('end', () => resolve('end'));
          stream.on('finish', () => resolve('finish'));
          stream.on('error', error => reject(error));

          logGeneratePDF({ title, filename });

          doc.pipe(stream);

          doc.addPage({ margin: 0 });
          doc.image(path.resolve(settings.templateDir, template, image), 0, 0, {
            fit: [pdf.size[0], pdf.size[1]],
          });
          doc.image(
            path.resolve(`${baseDir}/qr/${address}.png`),
            pdf.qrLeft,
            pdf.qrTop,
            {
              align: 'center',
              width: pdf.qrWidth,
              height: pdf.qrWidth,
            },
          );
          doc.end();
        } catch (error) {
          throw logger.error(error);
        }
      });
    }
  } catch (error) {
    throw logger.error(error);
  }
};

export default generatePDF;
