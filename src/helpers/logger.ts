import { getLogger, configure, Logger } from "log4js";
import loggerConfig from "../configs/loggerConfig.json";

const logger: Logger = getLogger("GoldenTicket");

configure(loggerConfig);

logger.log("Welcome");

export default getLogger;
