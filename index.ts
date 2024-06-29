require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { getLogger } from "./src/components/logger";
import { App } from "./src/server";

const main = async () => {
  try {
    const logger = await getLogger("api");
    const expressApp = express();

    const app = new App({
      express: expressApp,
      logger,
    });

    await app.start();
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
};

main();
