import { PDFController } from "@controllers/index";
import { Router } from "express";

const PDFRouter = Router();
const pdfController = new PDFController();


PDFRouter.post("/fill-by-url", pdfController.fillPdfByUrl);
PDFRouter.post("/fill-pdf-by-name", pdfController.fillPdfByName);
PDFRouter.post("/get-fillable-fields-by-url", pdfController.getFillableFields);
PDFRouter.post(
  "/get-fillable-fields-by-buffer",
  pdfController.getFillableFieldsByBuffer
);

export default PDFRouter;
