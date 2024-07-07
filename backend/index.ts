import "reflect-metadata";
import express from "express";
import { getLogger } from "./src/components/logger";
import { App } from "./src/server";
import { initLogger } from "@middlewares/logger.middleware";
import cluster from "cluster";
import os from "os";
import dotenv from "dotenv";
dotenv.config();
const numCPUs = os.cpus().length;

const startWorker = async () => {
  try {
    // Initialize the logger
    await initLogger();

    const logger = await getLogger("API");
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

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Optionally, you can restart the worker here
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  startWorker().then(() => {
    console.log(`Worker ${process.pid} started`);
  });
}
