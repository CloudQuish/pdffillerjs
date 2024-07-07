import { Request, Response, NextFunction } from "express";
import { getLogger as getPinoLogger } from "../components/logger";
import { Logger } from "pino";

// Logger instance
let logger: Logger;

// Initialize the logger
export const initLogger = async (): Promise<void> => {
  if (!logger) {
    logger = await getPinoLogger("API");
  }
};

// Get the logger instance
export const getLogger = (): Logger => {
  if (!logger) {
    throw new Error("Logger not initialized. Call initLogger() first.");
  }
  return logger;
};

// Middleware to log requests
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  initLogger();
  const logger = getLogger();
  logger.info(`${req.method} ${req.url}`);
  next();
};
