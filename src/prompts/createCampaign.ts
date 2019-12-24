import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import settings from '../../settings.json';
import createMothership from './createMothership';
import selectTemplate from './selectTemplate';
import { getLocales } from '../i18n';
import {
  colorQuestion,
  colorOutput,
  OutputStyles,
} from '../helpers/colorFormatters';
import createTickets from './createTickets';
import displayCampaign from './displayCampaign';

/**
 * Takes user through campaign configuration
 *
 * @returns {Promise<Campaign>}
 */
const createCampaign = async (master?: Campaign): Promise<Campaign | null> => {
  const logger = getLogger();
  const { CAMPAIGN } = getLocales(settings.locale as Locale);
  logger.debug('createCampaign');

  try {
    // eslint-disable-next-line no-console
    console.clear();
    // template
    const template = await selectTemplate();
    if (!template) return null;

    // eslint-disable-next-line no-console
    console.clear();
    // title
    const title: string = readlineSync.question(
      colorQuestion(CAMPAIGN.TITLE, CAMPAIGN.TITLE_DEFAULT),
      { defaultInput: master ? master.title : CAMPAIGN.TITLE_DEFAULT },
    );

    // mothership
    const mothership = await createMothership(settings.hdpath);
    if (!mothership) return null;

    // tickets
    const tickets = await createTickets();
    if (!tickets) return null;

    // put it all together
    const campaignData: Campaign = {
      title,
      tickets,
      template: template.title,
      mothership,
    };

    // display info and confirm
    await displayCampaign(campaignData);

    if (
      !readlineSync.keyInYNStrict(
        colorOutput({ item: CAMPAIGN.CONFIRM, style: OutputStyles.Warning }),
      )
    )
      return null;

    // save the campaign details
    const filename = `${settings.outDir}/${campaignData.title}/config.json`;
    fs.outputFileSync(filename, JSON.stringify(campaignData));

    logger.info(
      colorOutput({
        item: CAMPAIGN.INFO_WRITE_SUCCESS,
        value: filename,
      }),
      '\n',
    );
    readlineSync.keyInPause();
    return campaignData;
  } catch (error) {
    throw logger.error(error);
  }
};

export default createCampaign;
