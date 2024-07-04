import { Router } from "express";
import PDFRouter from "./pdf.router";
import UserRouter from "./user.router"

const baseRouter = () => {
  const router = Router();

  router.use("/", PDFRouter);
  router.use("/user",UserRouter)

  router.use("*", (req, res) => {
    res.status(404).json({
      status: "error",
      message: "Not Found",
    });
  });

  return router;
};

export default baseRouter;
