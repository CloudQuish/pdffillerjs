import { z } from "zod";
import { ApiJSONInputSchema } from "@config";

const availablePdfs = ["i693"];

export const fillPdfByUrlSchema = z.object({
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

export const fillPdfByNameSchema = z.object({
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

export const getFillableFieldsSchema = z.object({
  file_url: z
    .string({
      required_error:
        "Please provide 'file_url'. It is the URL of the PDF file",
    })
    .url(),
});

export const getFillableFieldsByBufferSchema = z.object({
  pdf_buffer: z
    .string({
      required_error:
        "Please provide 'pdf_buffer'. It is the buffer of the PDF file",
    })
    .min(1),
});
