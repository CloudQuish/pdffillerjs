import { PDFDocument } from "pdf-lib";
import fs from "fs";
import * as Yup from "yup";
import { Request, Response, NextFunction } from "express";
import { sendError } from "@utils";

export const verifyFieldNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = Yup.object().shape({
      data: Yup.object().required().strict(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const pdfBytes = fs.readFileSync(req.file.path);

    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    const formFields = form.getFields();
    const fieldNames = formFields.map((field) => field?.getName());

    const providedFields = Object.keys(req.body.data);

    // Identify missing fields that are present in the PDF but not provided
    const missingFields = fieldNames.filter(
      (fieldName) => !providedFields.includes(fieldName)
    );

    if (missingFields.length > 0) {
      return sendError({
        res,
        status: 400,
        message: `Please provide values for the following fields: ${missingFields.join(
          ", "
        )}`,
      });
    }

    next();
  } catch (error) {
    return sendError({
      res,
      status: 400,
      message: error.message || "Validation failed",
    });
  }
};
