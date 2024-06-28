import express from "express";
import connectDB from "./bootstrap/database";
import { middlewaresConfig } from "@middlewares/index";

import baseRouter from "@routes";
import IUser from "./interfaces/IUser";

//global variables
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const getApp = async () => {
  const app = express();
  await middlewaresConfig(app);
  // await connectDB();
  app.use("/api", baseRouter());

  return app;
};

export default getApp;
