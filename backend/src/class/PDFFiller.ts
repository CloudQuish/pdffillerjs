import { ApiJSONInputSchema } from "@config";

class PDFFiller {
  private filledPDFBuffer: Buffer;
  constructor(private pdfBuffer: Buffer) {}

  fillPDF(fillingValues: (typeof ApiJSONInputSchema)[]) {
    console.log(this.pdfBuffer);
  }

  getPDFBuffer() {
    return this.filledPDFBuffer;
  }
}
