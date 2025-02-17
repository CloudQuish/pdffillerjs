import { Express } from "express";
import http, { Server } from "http";
import { Logger } from "pino";
import { middlewaresConfig } from "@middlewares/index";
import baseRouter from "@routes";
import { connectDatabase } from "./bootstrap/database";
import APIKey from "./entity/api.entity";

declare global {
  namespace Express {
    interface Request {
      api_key: APIKey
    }
  }
}
export interface AppContext {
  app: App;
}

export type AppParams = {
  express: Express;
  logger: Logger;
};

export class App {
  private readonly express: Express;
  private readonly server: Server;
  private readonly logger: Logger;

  constructor(params: AppParams) {
    this.express = params.express;
    this.server = http.createServer(this.express);
    this.logger = params.logger;
  }

  private async setup() {
    try {
      await this.attachMiddlewares();
      this.setupRoutes();
      this.setupSignalHandlers();
      this.startServer();
    } catch (error) {
      this.logger.error("Failed to start the application", error);
      process.exit(1);
    }
  }

 

  private async attachMiddlewares() {
    await middlewaresConfig(this.express);
    await connectDatabase();
  }

  private setupRoutes() {
    this.express.use("/api", baseRouter());
  }

  private setupSignalHandlers() {
    process.on("SIGINT", () => this.shutdown());
    process.on("SIGTERM", () => this.shutdown());
  }

  private async startServer() {
    // wait for some time before starting the server in order to avoid EADDRINUSE error
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const port = process.env.PORT || 8000;
    this.server.listen(port, () => {
      this.logger.info(`Server is running on port ${port}`);
    });
  }

  public async shutdown() {
    try {
      this.logger.info("Shutting down server...");

      // Close server to stop accepting new connections
      await new Promise<void>((resolve, reject) => {
        this.server.close((err?: any) => {
          if (err) {
            this.logger.error("Error closing server", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      this.logger.info("Server has shut down gracefully");
      process.exit(2);
    } catch (error) {
      this.logger.error("Error during shutdown", error);
      process.exit(1);
    }
  }

  async start() {
    await this.setup();
  }
}
