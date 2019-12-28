import path from 'path';
import fs from 'fs-extra';
import getSettings from './getSettings';

const getCampaignDistribution = (title: string): CSV[] => {
  const settings = getSettings();
  const configFile = `${settings.outDir}/${title}/campaign.json`;
  const configPath: string = path.resolve(configFile);
  const distRaw: string = fs.readFileSync(configPath).toString();
  const distribution: CSV[] = JSON.parse(distRaw);
  return distribution;
};

export default getCampaignDistribution;
