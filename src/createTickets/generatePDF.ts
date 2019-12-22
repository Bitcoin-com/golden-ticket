import fs from "fs-extra";
import pdf from "html-pdf";
import { emoji } from "node-emoji";
import { Campaign, PDF } from "../interfaces";
import {
  generateConfig,
  sleep,
  getLogger,
  colorOutput,
  OutputStyles
} from "../helpers";
import settings from "../settings.json";

const logger = getLogger("generatePDF");

/**
 * Generates and saves PDF Files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generatePDF = async (
  wifs: string[],
  campaignData: Campaign
): Promise<void> => {
  try {
    const { strings } = generateConfig("CREATE_TICKETS");
    const { title } = campaignData;

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_PDF,
        value: title,
        style: OutputStyles.Start
      })
    );

    for (const wif in wifs) {
      await sleep(settings.timer);
      const htmlFilename = `${settings.outDir}/${title}/html/${wifs[wif]}.html`;
      const pdfFilename = `${settings.outDir}/${title}/pdf/${wifs[wif]}.pdf`;

      // save to pdf
      const { pdfConfig }: { pdfConfig: PDF } = settings;

      // get html file
      const privKeyWIFsHtml: string = fs.readFileSync(htmlFilename, "utf8");

      pdf.create(privKeyWIFsHtml, pdfConfig).toFile(pdfFilename, (err: any) => {
        if (err) return logger.error(err.message);
      });
      logger.info(
        colorOutput({ item: strings.INFO_GENERATED_PDF, value: pdfFilename })
      );
    }

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_PDF_COMPLETE,
        value: title,
        style: OutputStyles.Complete
      })
    );
  } catch (error) {
    return error;
  }
};

export default generatePDF;
