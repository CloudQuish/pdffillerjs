import { z } from "zod";
export const file_type_allowed = [
  "files",
  "identification_document",
  "vaccination_card",
  "lab_document",
];

export const ApiJSONInputSchema = z.object({
  accessor: z.string({
    required_error:
      "Accessor is required | It is the field name that you want to fill in the pdf file",
  }),
  value: z.any({
    required_error:
      "Value is required | It is the value of the field that you want to fill in the pdf file",
  }),
  type: z.enum(["text", "dropdown", "checkbox", "radio", "image"], {
    required_error:
      "Type is required | It is the type of the field that you want to fill in the pdf file",
  }),
  coordinates: z
    .object({
      x: z.number({
        required_error:
          "X coordinate is required | It is the x coordinate of the field that you want to fill in the pdf file",
      }),
      y: z.number({
        required_error:
          "Y coordinate is required | It is the y coordinate of the field that you want to fill in the pdf file",
      }),
      width: z.number({
        required_error:
          "Width is required | It is the width of the field that you want to fill in the pdf file",
      }),
      height: z.number({
        required_error:
          "Height is required | It is the height of the field that you want to fill in the pdf file",
      }),
      page_index: z.number({
        required_error:
          "Page index is required | It is the page index of the field that you want to fill in the pdf file",
      }),
    })
    .optional(),
});
