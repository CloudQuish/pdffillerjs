import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loggerMiddleware } from "./logger.middleware";

export const middlewaresConfig = (app: Express) => {
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(loggerMiddleware);

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
};
