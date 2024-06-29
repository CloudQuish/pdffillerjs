import { ApiJSONInputSchema } from "@config";
import { PDFServices } from "@services";
import { errorHandler, sendError, sendSuccess } from "@utils";
import axios from "axios";
import { Request, Response } from "express";
import { z } from "zod";
import fs from "fs";
import path from "path";

const fill_pdf = async (req: Request, res: Response) => {
  return sendSuccess({
    res,
    status: 200,
    message: "Success",
    data: {},
  });
};

const fill_pdf_by_url = async (req: Request, res: Response) => {
  const { file_url, filling_values } = req.body;
  try {
    const schema = z.object({
      file_url: z
        .string({
          required_error:
            "Please provided 'file_url' | It is the url of the pdf file",
        })
        .url(),
      filling_values: z.array(ApiJSONInputSchema).nonempty({
        message:
          "Please provide 'filling_values' | It is the array of the fields that you want to fill in the pdf file",
      }),
    });

    schema.parse({
      file_url,
      filling_values,
    });
    const { data: buffer } = await axios.get(file_url, {
      responseType: "arraybuffer",
    });
    const result = await PDFServices.fillPDF({
      pdfBuffer: Buffer.from(buffer),
      fillingValues: filling_values,
    });
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
    console.log(error);
    return errorHandler(res, error);
  }
};

const fill_pdf_by_name = async (req: Request, res: Response) => {
  const { pdf_name, filling_values } = req.body;

  try {
    const availablePdfs = ["i693"];
    const schema = z.object({
      pdf_name: z.string({
        required_error: `Please provided a valid pdf_name (no extension needed) | It should be one of the following: ${availablePdfs.join(
          ", "
        )}`,
      }),

      filling_values: z.array(ApiJSONInputSchema).nonempty({
        message:
          "Please provide 'filling_values' | It is the array of the fields that you want to fill in the pdf file",
      }),
    });

    schema.parse({
      pdf_name,
      filling_values,
    });
    const filePath = path.join(__dirname, `../files/forms/${pdf_name}.pdf`);
    const buffer = fs.readFileSync(filePath);

    const result = await PDFServices.fillPDF({
      pdfBuffer: Buffer.from(buffer),
      fillingValues: filling_values,
    });
    return sendSuccess({
      res,
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(res, error);
  }
};

const get_fillable_fields = async (req: Request, res: Response) => {
  const { file_url } = req.body;
  try {
    const schema = z.object({
      file_url: z
        .string({
          required_error:
            "Please provided 'file_url' | It is the url of the pdf file",
        })
        .url(),
    });

    schema.parse({
      file_url,
    });

    const { data: buffer } = await axios.get(file_url, {
      responseType: "arraybuffer",
    });
    const result = await PDFServices.getFillableFields({
      pdfBuffer: Buffer.from(buffer),
    });
    return sendSuccess({
      res,
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(res, error);
  }
};

const get_fillable_fields_by_buffer = async (req: Request, res: Response) => {
  const { pdf_buffer } = req.body;
  try {
    const schema = z.object({
      pdf_buffer: z
        .string({
          required_error:
            "Please provided 'pdf_buffer' | It is the buffer of the pdf file",
        })
        .min(1),
    });

    schema.parse({
      pdf_buffer,
    });
    const result = await PDFServices.getFillableFields({
      pdfBuffer: Buffer.from(pdf_buffer, "base64"),
    });
    if (!result)
      return sendError({
        res,
        status: 400,
        message: "No fillable fields found | Or there is error in the pdf file",
      });
    return sendSuccess({
      res,
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

export default {
  fill_pdf,
  fill_pdf_by_url,
  fill_pdf_by_name,
  get_fillable_fields,
  get_fillable_fields_by_buffer,
};
