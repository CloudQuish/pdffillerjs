import { PDFController } from "@controllers/index";
import { DynamicUploadMiddleware } from "@middlewares/upload.middleware";
import { verifyFieldNames } from "@middlewares/fieldverifier.middleware";
import { Router } from "express";

const PDFRouter = Router();
const dynamicUploader = new DynamicUploadMiddleware({ type: "single" });
const pdfController = new PDFController();

PDFRouter.post(
  "/fill",
  verifyFieldNames,
  dynamicUploader.middleware,
  pdfController.fillPdf
);

PDFRouter.post("/fill-by-url", pdfController.fillPdfByUrl);
PDFRouter.post("/fill-pdf-by-name", pdfController.fillPdfByName);
PDFRouter.post("/get-fillable-fields-by-url", pdfController.getFillableFields);
PDFRouter.post(
  "/get-fillable-fields-by-buffer",
  pdfController.getFillableFieldsByBuffer
);

export default PDFRouter;
