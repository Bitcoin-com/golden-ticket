import fs from "fs-extra";
import QRCode from "qrcode";
import { getLogger } from "log4js";
import { sleep, colorOutput, OutputStyles } from "../helpers";
import { Campaign } from "../interfaces";
import { defaultTemplate } from "../templates";
import settings from "../settings.json";
import { locales } from "../i18n";

const logger = getLogger("generateHTML");

/**
 * Saves HTML files
 *
 * @param {string} filename
 * @param {string} wifQR
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const saveHTMLFile = async (
  filename: string,
  wifQR: string,
  campaignData: Campaign
): Promise<void> => {
  try {
    fs.writeFileSync(filename, defaultTemplate(campaignData, wifQR));
  } catch (error) {
    return error;
  }
};

/**
 * Generates HTML files
 *
 * @param {string[]} wifs
 * @param {Campaign} campaignData
 * @returns {Promise<void>}
 */
const generateHTML = async (
  wifs: string[],
  campaignData: Campaign
): Promise<void> => {
  try {
    const strings = locales[settings.defaultLocale];

    const { title } = campaignData;

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_HTML,
        value: title,
        style: OutputStyles.Start
      })
    );

    for (const wif in wifs) {
      await sleep(settings.timer);
      const filename = `${settings.outDir}/${title}/html/${wifs[wif]}.html`;
      QRCode.toDataURL(
        wifs[wif],
        { margin: 0 },
        async (_err: Error, wifQR: string): Promise<void> => {
          await saveHTMLFile(filename, wifQR, campaignData);
        }
      );
      logger.info(
        colorOutput({ item: strings.INFO_GENERATED_HTML, value: filename })
      );
    }

    logger.info(
      colorOutput({
        item: strings.INFO_GENERATING_HTML_COMPLETE,
        value: title,
        style: OutputStyles.Complete
      })
    );
  } catch (error) {
    return error;
  }
};

export default generateHTML;
