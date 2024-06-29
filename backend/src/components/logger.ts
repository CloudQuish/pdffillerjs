import pino, { Logger } from "pino";

let loggerInstance: Logger;

export const getLogger = async (serviceName: string) => {
  if (loggerInstance) {
    return loggerInstance;
  }

  const logger = pino({
    name: serviceName,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        singleLine: true,
      },
    },
  });
  return logger;
};
