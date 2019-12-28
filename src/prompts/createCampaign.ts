import fs from 'fs-extra';
import { getLogger } from 'log4js';
import readlineSync from 'readline-sync';
import { OutputStyles, colorOutput } from '../helpers/colorFormatters';

import createMothership from './createMothership';
import createTickets from './createTickets';
import { getLocales } from '../i18n';
import selectTemplate from './selectTemplate';
import getSettings from '../helpers/getSettings';
import generateWIFs from '../helpers/generateWIFs';
import generateHTML from '../helpers/generateHTML';
import generatePDF from '../helpers/generatePDF';
import generateCSV from '../helpers/generateCSV';

import logCampaignOutput from '../logger/logCampaignOutput';
import logCampaignCreate from '../logger/logCampaignCreate';
import logCampaignSummary from '../logger/logCampaignSummary';

const logger = getLogger();
const settings = getSettings();
const { DEFAULTS, QUESTIONS } = getLocales(settings.locale);

/**
 * Takes user through campaign configuration
 *
 * @param {Campaign} [master]
 * @returns {(Promise<Campaign | null>)}
 */
const createCampaign = async (master?: Campaign): Promise<Campaign | null> => {
  try {
    // template
    const template = selectTemplate();
    if (!template) return null;

    logCampaignCreate(master);

    // the title
    const title: string = readlineSync.question(
      colorOutput({
        item: QUESTIONS.CAMPAIGN_TITLE,
        value: DEFAULTS.CAMPAIGN_TITLE,
        style: OutputStyles.Question,
      }),
      { defaultInput: master ? master.title : DEFAULTS.CAMPAIGN_TITLE },
    );

    // mothership
    const mothership = await createMothership(settings.hdpath, master);
    if (!mothership) return null;

    // tickets
    const tickets = createTickets(master);
    if (!tickets) return null;

    // put it all together
    const campaignData: Campaign = {
      title,
      tickets,
      template: template.name,
      mothership,
    };

    // display info and confirm
    logCampaignSummary(campaignData);

    if (
      !readlineSync.keyInYNStrict(
        colorOutput({
          item: QUESTIONS.CAMPAIGN_CONFIRM,
          style: OutputStyles.Question,
        }),
      )
    )
      return null;

    // save the campaign details
    const path = `${settings.outDir}/${campaignData.title}`;
    const filename = `${path}/config.json`;
    fs.outputFileSync(filename, JSON.stringify(campaignData));

    // generate the files
    await generateWIFs(campaignData);
    await generateCSV(campaignData);
    await generateHTML(campaignData);
    await generatePDF(campaignData);

    logCampaignOutput(campaignData, path);

    readlineSync.keyInPause(
      colorOutput({ item: QUESTIONS.CONTINUE, style: OutputStyles.Question }),
    );
    return campaignData;
  } catch (error) {
    throw logger.error(error);
  }
};

export default createCampaign;
