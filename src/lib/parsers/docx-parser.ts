import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';

export async function parseDocx(file: File): Promise<string> {
  try {
    const loader = new DocxLoader(file);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join('\n');
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`DOCX parsing error: ${error.message}`);
    }

    throw new Error(`DOCX parsing error: ${String(error)}`);
  }
}