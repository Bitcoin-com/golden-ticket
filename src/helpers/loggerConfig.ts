import settings from '../../settings.json';

const loggerConfig = {
  appenders: {
    app: {
      type: 'file',
      filename: 'log/app.log',
      maxLogSize: 10485760,
      numBackups: 3,
    },
    configureCampaign: {
      type: 'file',
      filename: 'log/configureCampaign.log',
      maxLogSize: 10485760,
      numBackups: 3,
    },
    errorFile: {
      type: 'file',
      filename: 'log/errors.log',
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
    console: {
      type: 'console',
      layout: {
        type: 'messagePassThrough',
      },
    },
  },
  categories: {
    configureCampaign: {
      appenders: ['console', 'configureCampaign', 'errors'],
      level: 'DEBUG',
    },
    default: {
      appenders: ['console', 'app', 'errors'],
      level: settings.debug ? 'DEBUG' : 'INFO',
    },
  },
};

export default loggerConfig;
