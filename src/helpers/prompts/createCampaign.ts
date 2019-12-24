import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import settings from '../../../settings.json';
import generateMnemonic from '../../configureCampaign/generateMnemonic';
import createMothership from '../createMothership';
import selectTemplate from './selectTemplate';
import { getLocales } from '../../i18n';
import { colorQuestion } from '../colorFormatters';

/**
 * Takes user through campaign configuration
 *
 * @returns {Promise<Campaign>}
 */
const createCampaign = async (): Promise<Campaign | null> => {
  const logger = getLogger();
  const { CAMPAIGN } = getLocales(settings.locale as Locale);
  logger.debug('createCampaign');

  try {
    // get campaign title
    const title = readlineSync.question(
      colorQuestion(CAMPAIGN.TITLE, CAMPAIGN.TITLE_DEFAULT),
      { defaultInput: CAMPAIGN.TITLE_DEFAULT },
    );

    // get total number of tickets
    const ticketsCount = readlineSync.questionInt(
      colorQuestion(CAMPAIGN.TICKETS_NUMBER, settings.tickets.toString()),
      {
        defaultInput: settings.tickets.toString(),
        limit: '^[0-9]{1,5}$',
        limitMessage: 'Must be between 1 and 10,000 (0 to exit)',
      },
    );

    if (ticketsCount === 0) return null;

    // asks user to enter mnemonic or eneter their own
    const mnemonic = readlineSync.keyInYNStrict(
      colorQuestion(CAMPAIGN.MNEMONIC, CAMPAIGN.MNEMONIC_DEFAULT),
    )
      ? readlineSync.question(CAMPAIGN.MNEMONIC_ENTER)
      : await generateMnemonic(settings.languages[settings.locale]);

    if (mnemonic.length === 0) return null;

    const template = await selectTemplate();

    const campaignData: Campaign = {
      title,
      tickets: { count: ticketsCount, spread: { '0': 1 } },
      template,
      mothership: createMothership(mnemonic, settings.hdpath),
    };

    return campaignData;
  } catch (error) {
    throw logger.error(error);
  }
};

export default createCampaign;
