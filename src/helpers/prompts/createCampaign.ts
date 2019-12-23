import { getLogger } from "log4js";
import { Campaign, Locale } from "../../interfaces";
import readlineSync from "readline-sync";
import settings from "../../../settings.json";

import { locales } from "../../i18n";
import getMnemonic from "../getMnemonic";
import createMothership from "../createMothership";
import getLocales from "../getLocales";

const logger = getLogger("promptCreateCampaign");
const { CAMPAIGN } = getLocales(settings.defaultLocale as Locale);

const createCampaign = async (): Promise<Campaign> => {
  try {
    logger.debug("createCampaign");

    readlineSync.setDefaultOptions({});
    const title = readlineSync.question(CAMPAIGN.TITLE, {
      defaultInput: CAMPAIGN.TITLE_DEFAULT
    });
    const ticketCount = readlineSync.questionInt(CAMPAIGN.TICKETS_NUMBER, {
      defaultInput: settings.defaultTickets.toString()
    });
    const { hdpath } = settings;

    const mnemonic = getMnemonic();

    const campaignData: Campaign = {
      title,
      mnemonic,
      hdpath,
      ticketCount,
      mothership: createMothership(mnemonic, hdpath)
    };

    return campaignData;
  } catch (error) {
    throw error;
  }
};

export default createCampaign;
