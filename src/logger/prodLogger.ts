import * as winston from "winston";

const prodLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});

export default prodLogger;
