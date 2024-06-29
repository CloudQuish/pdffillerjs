import { PDFController } from "@controllers/index";
import { DynamicUploadMiddleware } from "@middlewares/upload.middleware";
import { verifyFieldNames } from "@middlewares/fieldverifier.middleware";
import { Router } from "express";

const PDFRouter = Router();
const dynamicUploader = new DynamicUploadMiddleware({ type: "single" });

PDFRouter.post(
  "/fill",
  verifyFieldNames,
  dynamicUploader.middleware,
  PDFController.fill_pdf
);

PDFRouter.post("/fill-by-url", PDFController.fill_pdf_by_url);
PDFRouter.post("/fill-pdf-by-name", PDFController.fill_pdf_by_name);
PDFRouter.post(
  "/get-fillable-fields-by-url",
  PDFController.get_fillable_fields
);
PDFRouter.post(
  "/get-fillable-fields-by-buffer",
  PDFController.get_fillable_fields_by_buffer
);

export default PDFRouter;
