import { Request, Response } from "express";
import { z } from "zod";
import axios from "axios";
import fs from "fs";
import path from "path";
import { PDFService } from "@services";
import { sendError, sendSuccess } from "@utils";
import { ApiJSONInputSchema } from "@config";
import { getLogger } from "../components/logger";
import { Logger } from "pino";

class PDFController {
  private logger: Logger;

  constructor() {
    this.initLogger();
    console.log("PDFController constructor");
  }

  private async initLogger() {
    this.logger = await getLogger("PDFController");
  }

  async fillPdf(req: Request, res: Response) {
    this.logger.info("fillPdf");
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
      const schema = z.object({
        file_url: z
          .string({
            required_error:
              "Please provide 'file_url'. It is the URL of the PDF file",
          })
          .url(),
        filling_values: z.array(ApiJSONInputSchema).nonempty({
          message:
            "Please provide 'filling_values'. It is the array of fields to fill in the PDF file",
        }),
      });

      schema.parse({ file_url, filling_values });

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
    const availablePdfs = ["i693"];

    try {
      const schema = z.object({
        pdf_name: z
          .string({
            required_error: `Please provide a valid 'pdf_name' (no extension needed). It should be one of the following: ${availablePdfs.join(
              ", "
            )}`,
          })
          .refine((value) => availablePdfs.includes(value), {
            message: `Invalid 'pdf_name'. It should be one of: ${availablePdfs.join(
              ", "
            )}`,
          }),
        filling_values: z.array(ApiJSONInputSchema).nonempty({
          message:
            "Please provide 'filling_values'. It is the array of fields to fill in the PDF file",
        }),
      });

      schema.parse({ pdf_name, filling_values });

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
    const { file_url } = req.body;

    try {
      const schema = z.object({
        file_url: z
          .string({
            required_error:
              "Please provide 'file_url'. It is the URL of the PDF file",
          })
          .url(),
      });

      schema.parse({ file_url });

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
      const schema = z.object({
        pdf_buffer: z
          .string({
            required_error:
              "Please provide 'pdf_buffer'. It is the buffer of the PDF file",
          })
          .min(1),
      });

      schema.parse({ pdf_buffer });

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
