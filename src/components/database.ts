import { Logger } from "pino";
import { AppDataSource } from "../bootstrap/data-source";

export class DatabaseConnector {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async connect() {
    try {
      const response = await AppDataSource.initialize();
      this.logger.info("Database connection established");
      return response;
    } catch (error: any) {
      this.logger.error(error.stack);
      process.exit(1);
    }
  }
}
