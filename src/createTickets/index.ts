// imports
import fs from "fs-extra";
import getUserInput from "./getUserInput";
import generateWIFs from "./generateWIFs";
import generateHTML from "./generateHTML";
import generatePDF from "./generatePDF";
import settings from "../settings.json";
import { getLogger, colorOutput } from "../helpers";
import { emoji } from "node-emoji";

const logger = getLogger("createTickets");

const main: any = async (): Promise<any> => {
  try {
    const campaignData = await getUserInput();
    const { title } = campaignData;

    if (!title) return new Error();

    // create needed directory structure
    fs.ensureDirSync(`${settings.outDir}/${title}/html/`);
    fs.ensureDirSync(`${settings.outDir}/${title}/pdf/`);
    fs.ensureFileSync(`${settings.outDir}/${title}/privKeyWIFs`);

    const wifs = await generateWIFs(campaignData);

    logger.info("============================================================");
    await generateHTML(wifs, campaignData);
    logger.info("============================================================");
    await generatePDF(wifs, campaignData);
    logger.info("============================================================");

    logger.info(colorOutput("Tickee", title), emoji.white_check_mark);
  } catch (err) {
    return err;
  }
};

export default main();
