import { parsePDF } from './pdf-parser';
import { parseDocx } from './docx-parser';
import { parseTxt } from './txt-parser';

export async function parseCV(file: File): Promise<string> {
  try {
    switch (file.type) {
      case 'application/pdf':
        return await parsePDF(file);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await parseDocx(file);
      case 'text/plain':
        return await parseTxt(file);
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`CV parsing error: ${error.message}`);
    }
    // If error is not an Error object, convert to string
    throw new Error(`CV parsing error: ${String(error)}`);
  }
}