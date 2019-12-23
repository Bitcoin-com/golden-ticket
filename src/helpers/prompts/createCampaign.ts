import { getLogger } from "log4js";
import { Campaign } from "../../interfaces";
import readlineSync from "readline-sync";
import settings from "../../settings.json";

import { locales } from "../../i18n";
import getMnemonic from "../getMnemonic";
import createMothership from "../createMothership";

const logger = getLogger("promptCreateCampaign");

const createCampaign = async (): Promise<Campaign> => {
  try {
    logger.debug("createCampaign");
    const title = readlineSync.question("give name");
    const { CAMPAIGN } = locales[settings.defaultLocale];
    const { hdpath } = settings;

    const mnemonic = getMnemonic();

    const campaignData: Campaign = {
      title,
      mnemonic,
      hdpath,
      ticketCount: readlineSync.questionInt(CAMPAIGN.TITLE, {
        defaultInput: CAMPAIGN.TITLE_DEFAULT
      }),
      mothership: createMothership(mnemonic, hdpath)
    };

    return campaignData;
  } catch (error) {
    throw error;
  }
};

export default createCampaign;
