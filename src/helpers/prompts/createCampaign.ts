import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { Campaign, Locale } from '../../interfaces';
import settings from '../../../settings.json';
import getMnemonic from '../getMnemonic';
import createMothership from '../createMothership';
import { getLocales } from '../../i18n';

const logger = getLogger('promptCreateCampaign');
const { CAMPAIGN } = getLocales(settings.defaultLocale as Locale);

const createCampaign = (): Campaign => {
  logger.debug('createCampaign');

  readlineSync.setDefaultOptions({});
  const title = readlineSync.question(CAMPAIGN.TITLE, {
    defaultInput: CAMPAIGN.TITLE_DEFAULT,
  });
  const ticketCount = readlineSync.questionInt(CAMPAIGN.TICKETS_NUMBER, {
    defaultInput: settings.defaultTickets.toString(),
  });
  const { hdpath } = settings;

  const mnemonic = getMnemonic();

  const campaignData: Campaign = {
    title,
    mnemonic,
    hdpath,
    ticketCount,
    mothership: createMothership(mnemonic, hdpath),
  };

  return campaignData;
};

export default createCampaign;
