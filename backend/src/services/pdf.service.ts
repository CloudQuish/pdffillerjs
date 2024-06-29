import axios from "axios";
import { PDFDocument, PDFForm } from "pdf-lib";

interface FillingValue {
  accessor: string;
  value: any;
  type: "text" | "checkbox" | "dropdown" | "radio" | "image";
  coordinates?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    page_index?: number;
  };
}

class PDFService {
  private pdfDocPromise: Promise<PDFDocument>;

  constructor(pdfBuffer: Buffer) {
    this.pdfDocPromise = PDFDocument.load(pdfBuffer);
  }

  private async getPDFDoc(): Promise<PDFDocument> {
    return this.pdfDocPromise;
  }

  public async fillPDF(fillingValues: FillingValue[]): Promise<Buffer> {
    try {
      const pdfDoc = await this.getPDFDoc();
      const form = pdfDoc.getForm();
      for (const { accessor, value, type, coordinates } of fillingValues) {
        switch (type) {
          case "text":
            this.setText(accessor, value, form);
            break;
          case "checkbox":
            this.setCheckBox(accessor, value, form);
            break;
          case "dropdown":
            this.selectDropdown(accessor, value, form);
            break;
          case "radio":
            this.selectRadio(accessor, value, form);
            break;
          case "image":
            await this.setImage(value, coordinates);
            break;
        }
      }

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error("Error filling PDF:", error);
      throw new Error("Failed to fill PDF");
    }
  }

  private setText(accessor: string, value: string, form: PDFForm): void {
    const fieldNames = form
      .getFields()
      .map((field) => field.getName())
      .filter((name) => name.includes(accessor));

    for (const fieldName of fieldNames) {
      form.getTextField(fieldName).removeMaxLength();
      form.getTextField(fieldName).setText(value || "");
    }
  }

  private setCheckBox(accessor: string, value: boolean, form: PDFForm): void {
    if (value) {
      form.getCheckBox(accessor).check();
    } else {
      form.getCheckBox(accessor).uncheck();
    }
  }

  private selectDropdown(accessor: string, value: string, form: PDFForm): void {
    form.getDropdown(accessor).select(value);
  }

  private async selectRadio(
    accessor: string,
    value: string,
    form: PDFForm
  ): Promise<void> {
    form.getRadioGroup(accessor).select(value);
  }

  private async setImage(
    imageUrl: string,
    coordinates?: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      page_index?: number;
    }
  ): Promise<void> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBytes = response.data;

      const pdfDoc = await this.getPDFDoc();
      const image = await pdfDoc.embedPng(imageBytes);

      const pageIndex = coordinates?.page_index || 0;
      const page = pdfDoc.getPages()[pageIndex];

      const {
        x = 0,
        y = 0,
        width = image.width,
        height = image.height,
      } = coordinates || {};

      page.drawImage(image, {
        x,
        y,
        width,
        height,
      });
    } catch (error) {
      console.error("Error embedding image:", error);
      throw new Error("Failed to embed image");
    }
  }

  public async getFillableFields(): Promise<string[] | null> {
    try {
      const pdfDoc = await this.getPDFDoc();
      const form = pdfDoc.getForm();
      const allFields = form.getFields();
      const fieldNames = allFields.map((field) => field.getName());
      return fieldNames;
    } catch (error) {
      console.error("Error getting fillable fields:", error);
      throw new Error("Failed to get fillable fields");
    }
  }
}

export default PDFService;
