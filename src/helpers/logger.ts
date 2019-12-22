import { getLogger, configure, Logger } from "log4js";
import loggerConfig from "../configs/loggerConfig.json";

configure(loggerConfig);

export default getLogger;
