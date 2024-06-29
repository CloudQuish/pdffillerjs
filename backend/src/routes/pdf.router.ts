import { PDFController } from "@controllers/index";
import dynamicUpload from "@middlewares/dynamicUpload";
import { verify_filed_names_and_provied_entry } from "@middlewares/verify_field_name";
import { Router } from "express";

const PDFRouter = Router();

PDFRouter.post(
  "/fill",
  verify_filed_names_and_provied_entry,
  dynamicUpload,
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
