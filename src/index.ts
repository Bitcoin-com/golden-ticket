import { configure } from "log4js";
import settings from "./settings.json";
import stdout from "log4js/lib/appenders/stdout";

configure({
  appenders: {
    out: { type: stdout },
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
});

export { default as generateWallet } from "./generateWallet";

export default "./start";
