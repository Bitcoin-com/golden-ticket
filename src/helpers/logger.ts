import { getLogger, configure, Logger } from "log4js";
import settings from "../settings.json";

const loggerConfig = {
  appenders: {
    app: {
      type: "file",
      filename: "log/app.log",
      maxLogSize: 10485760,
      numBackups: 3
    },
    errorFile: {
      type: "file",
      filename: "log/errors.log"
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile"
    },
    console: {
      type: "console",
      layout: {
        type: "messagePassThrough"
      }
    }
  },
  categories: {
    default: {
      appenders: ["console", "app", "errors"],
      level: settings.debug ? "DEBUG" : "INFO"
    }
  }
};

configure(loggerConfig);

export default getLogger;
