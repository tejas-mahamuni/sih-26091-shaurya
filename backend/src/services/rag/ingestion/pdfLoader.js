//pdf to txt

const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");

async function loadPdf(filePath) {
  try {
    const pdfBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  } catch (error) {
    console.error("PDF loading failed:", error);
    throw new Error("Failed to load PDF");
  }
}

module.exports = {
  loadPdf,
};