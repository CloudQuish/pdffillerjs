import { ApiJSONInputSchema } from "@config";
import axios from "axios";
import { PDFDocument, PDFField, PDFForm } from "pdf-lib";
import { z } from "zod";
const fillPDF = async ({
  pdfBuffer,
  fillingValues,
}: {
  pdfBuffer: Buffer;
  fillingValues: z.infer<typeof ApiJSONInputSchema>[];
}) => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const form = pdfDoc.getForm();
  for (const { accessor, value, type, coordinates } of fillingValues) {
    switch (type) {
      case "text":
        setText({ accessor, value, fields: form.getFields(), form });
        break;
      case "checkbox":
        setCheckBox({ accessor, value, form });
        break;
      case "dropdown":
        selectDropdown({ accessor, value, form });
        break;
      case "radio":
        selectRadio({ accessor, value, form });
        break;
      case "image":
        await setImage({ image_url: value, pdfDoc, coordinates }); // Make sure to await setImage
        break;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

// helpers
const setText = ({
  accessor,
  value,
  fields,
  form,
}: {
  accessor: string;
  value: string;
  fields: PDFField[];
  form: PDFForm;
}) => {
  try {
    const fieldNames = fields
      .map((field) => field.getName())
      .filter((name) => name.includes(accessor));

    for (const fieldName of fieldNames) {
      form.getTextField(fieldName).removeMaxLength();
      form.getTextField(fieldName).setText(value || "");
    }
  } catch (error) {
    console.log("this is the error:" + error);
  }
};

const setCheckBox = ({
  accessor,
  form,
  value,
}: {
  accessor: string;
  value: boolean;
  form: PDFForm;
}) => {
  try {
    if (value) {
      form.getCheckBox(accessor).check();
    } else {
      form.getCheckBox(accessor).uncheck();
    }
  } catch (error) {
    console.log("this is the error:" + error);
  }
};

const selectDropdown = ({
  accessor,
  form,
  value,
}: {
  accessor: string;
  form: PDFForm;
  value: string;
}) => {
  try {
    form.getDropdown(accessor).select(value);
  } catch (error) {
    console.log("this is the error:" + error);
  }
};

const setImage = async ({
  image_url,
  pdfDoc,
  coordinates,
}: {
  image_url: string;
  pdfDoc: PDFDocument;
  coordinates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    page_index?: number;
  };
}) => {
  try {
    const response = await axios.get(image_url, {
      responseType: "arraybuffer",
    });
    const imageBytes = response.data;

    // Assume PNG image; use embedJpg or embedImage for different formats
    const image = await pdfDoc.embedPng(imageBytes);

    // Determine the page to add the image to
    const pageIndex = coordinates.page_index || 0; // Default to the first page if pageIndex not provided
    const page = pdfDoc.getPages()[pageIndex];

    // Use provided coordinates or default to image dimensions
    const {
      x = 0,
      y = 0,
      width = image.width,
      height = image.height,
    } = coordinates;

    page.drawImage(image, {
      x,
      y,
      width,
      height,
    });
  } catch (error) {
    console.log("Error in setImage:", error);
  }
};

const selectRadio = ({
  accessor,
  form,
  value,
}: {
  accessor: string;
  form: PDFForm;
  value: string;
}) => {
  try {
    form.getRadioGroup(accessor).select(value);
  } catch (error) {
    console.log("this is the error:" + error);
  }
};

const getFillableFields = async ({ pdfBuffer }: { pdfBuffer: Buffer }) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const form = pdfDoc.getForm();
    const allFields = form.getFields();
    const fieldNames = allFields.map((field) => field.getName());
    return fieldNames;
  } catch (error) {
    console.log("this is the error:" + error);
    return null;
  }
};
export default {
  fillPDF,
  getFillableFields,
};
