import { PDFDocument } from "pdf-lib";
import fs from "fs";
import * as Yup from "yup";
import { NextFunction, Request, Response } from "express";
import { sendError, errorHandler } from "@utils";

export const verify_filed_names_and_provied_entry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Yup.object().shape({
    data: Yup.object(),
  });
  try {
    const data = req.body;
    await schema.validate(
      {
        data,
      },
      {
        abortEarly: false,
      }
    );
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
    });
    // get fillable pdf fileds
    const form = pdfDoc.getForm();
    const formFields = form.getFields();
    const fieldNames = formFields.map((field) => field?.getName());

    // get fields names from the request body
    const providedFields = req.body;

    let not_provied_fields = [];
    for (let field of fieldNames) {
      if (!providedFields[field]) {
        not_provied_fields.push(field);
      }
    }
    if (not_provied_fields.length > 0) {
      return sendError({
        res,
        status: 400,
        message: `Please provide values for the following fields:`,
        data: not_provied_fields,
      });
    }
    next();
  } catch (error) {
    return sendError({
      res,
      status: 400,
      message: error.message,
    });
  }
};
