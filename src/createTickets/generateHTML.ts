import fs from "fs-extra";
import { emoji } from "node-emoji";
import QRCode from "qrcode";
import getLogger from "../helpers/logger";
import { generateConfig, sleep, colorOutput } from "../helpers";
import { Campaign } from "../interfaces";

import settings from "../settings.json";
import bgBase64 from "../assets/bgBase64";

const logger = getLogger("generateHTML");

const saveHTMLFile = async (filename: string, wifQR: string): Promise<void> => {
  try {
    fs.writeFileSync(
      filename,
      [
        `<body style="padding: 0; margin: 0;">`,
        `<div style="height: 100%; background-size: cover; background-position: no-repeat left center; background-image: url('${bgBase64}')">`,
        `<img style='position: absolute; top: 280px; left: 180px; height: 120px;' src='${wifQR}' />`,
        `</div></body>`
      ].join("")
    );
  } catch (error) {
    return error;
  }
};

const generateHTML = async (
  wifs: string[],
  campaignData: Campaign
): Promise<void> => {
  try {
    const { strings } = generateConfig("CREATE_TICKETS");
    const { title } = campaignData;

    logger.info(
      `${emoji.hourglass_flowing_sand} ${strings.INFO_GENERATING_HTML}`,
      title
    );

    for (const wif in wifs) {
      await sleep(settings.timer);
      const filename = `${settings.outDir}/${title}/html/${wifs[wif]}.html`;
      QRCode.toDataURL(
        wif,
        async (_err: Error, wifQR: string): Promise<void> => {
          await saveHTMLFile(filename, wifQR);
        }
      );
      logger.info(colorOutput(strings.INFO_GENERATED_HTML, filename));
    }

    logger.info(
      `${emoji.white_check_mark}  ${strings.INFO_GENERATING_HTML_COMPLETE}`,
      title
    );
  } catch (error) {
    return error;
  }
};

export default generateHTML;
