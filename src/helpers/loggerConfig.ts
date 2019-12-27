import getSettings from '../getSettings';

const loggerConfig = {
  appenders: {
    app: {
      type: 'file',
      filename: 'log/app.log',
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
    default: {
      appenders: ['console', 'app', 'errors'],
      level: getSettings().debug ? 'DEBUG' : 'INFO',
    },
  },
};

export default loggerConfig;
