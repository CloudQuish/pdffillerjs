require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { getLogger } from "./src/components/logger";
import { App } from "./src/server";
import { AppDataSource } from "./src/bootstrap/data-source";

const main = async () => {
  try {
    const logger = await getLogger("api");
    const expressApp = express();
    const database = AppDataSource;

    const app = new App({
      express: expressApp,
      database,
      logger,
    });

    await app.start();

    process.on("SIGINT", async () => {
      await app.shutdown();
    });

    process.on("SIGTERM", async () => {
      await app.shutdown();
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
};

main();
