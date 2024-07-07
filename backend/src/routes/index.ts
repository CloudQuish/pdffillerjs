import { Router } from "express";
import PDFRouter from "./pdf.router";
import UserRouter from "./apikey.router";
import { auth_token_api } from "@middlewares/auth.middleware";

const baseRouter = () => {
  const router = Router();
  router.use("/keys", UserRouter);
  router.use("/pdf", auth_token_api, PDFRouter);

  router.use("*", (req, res) => {
    res.status(404).json({
      status: "error",
      message: "Not Found",
    });
  });

  return router;
};

export default baseRouter;
