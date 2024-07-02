import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { PDFService } from "@services";
import { sendError, sendSuccess } from "@utils";
import { getLogger } from "../components/logger";
import { Logger } from "pino";
import {
  fillPdfByUrlSchema,
  fillPdfByNameSchema,
  getFillableFieldsSchema,
  getFillableFieldsByBufferSchema,
} from "../validations/pdffiller.validation";

class PDFController {
  async fillPdf(req: Request, res: Response) {
    return sendSuccess({
      res,
      status: 200,
      message: "Success",
      data: {},
    });
  }

  async fillPdfByUrl(req: Request, res: Response) {
    const { file_url, filling_values } = req.body;

    try {
      fillPdfByUrlSchema.parse({ file_url, filling_values });

      const { data: buffer } = await axios.get(file_url, {
        responseType: "arraybuffer",
      });
      const pdfService = new PDFService(Buffer.from(buffer));

      const result = await pdfService.fillPDF(filling_values);

      return sendSuccess({
        res,
        status: 200,
        message: "Success",
        data: {
          filled_pdf: result,
          type: "buffer",
        },
      });
    } catch (error) {
      return sendError({ res, status: 400, message: error.message });
    }
  }

  async fillPdfByName(req: Request, res: Response) {
    const { pdf_name, filling_values } = req.body;

    try {
      fillPdfByNameSchema.parse({ pdf_name, filling_values });

      const filePath = path.join(__dirname, `../files/forms/${pdf_name}.pdf`);
      const buffer = fs.readFileSync(filePath);

      const pdfService = new PDFService(buffer);
      const result = await pdfService.fillPDF(filling_values);

      return sendSuccess({
        res,
        status: 200,
        message: "Success",
        data: result,
      });
    } catch (error) {
      return sendError({ res, status: 400, message: error.message });
    }
  }

  async getFillableFields(req: Request, res: Response) {
    console.log("Pringint request body", req.body);
    const { file_url } = req.body;
    console.log("I am here printing request body", req.body);
    try {
      getFillableFieldsSchema.parse({ file_url });

      const { data: buffer } = await axios.get(file_url, {
        responseType: "arraybuffer",
      });

      const pdfService = new PDFService(Buffer.from(buffer));
      const result = await pdfService.getFillableFields();

      return sendSuccess({
        res,
        status: 200,
        message: "Success",
        data: result,
      });
    } catch (error) {
      return sendError({ res, status: 400, message: error.message });
    }
  }

  async getFillableFieldsByBuffer(req: Request, res: Response) {
    const { pdf_buffer } = req.body;

    try {
      getFillableFieldsByBufferSchema.parse({ pdf_buffer });

      const pdfService = new PDFService(Buffer.from(pdf_buffer, "base64"));
      const result = await pdfService.getFillableFields();

      if (!result) {
        return sendError({
          res,
          status: 400,
          message:
            "No fillable fields found or there was an error in the PDF file",
        });
      }

      return sendSuccess({
        res,
        status: 200,
        message: "Success",
        data: result,
      });
    } catch (error) {
      return sendError({ res, status: 400, message: error.message });
    }
  }
}

export default PDFController;
