"use server"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function parseWebPDF(file: File): Promise<string> {
  try {
    const loader = new WebPDFLoader(file);
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    throw new Error(`PDF parsing error: ${(error as Error).message}`);
  }
}

export async function parsePDF(file: File): Promise<string> {
  try {
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join("\n");
  } catch (error) {
    throw new Error(`PDF parsing error: ${(error as Error).message}`);
  }
}
