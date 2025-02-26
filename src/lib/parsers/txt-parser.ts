export async function parseTxt(file: File): Promise<string> {
    try {
      // For text files, we can directly use the built-in text() method
      const text = await file.text();
      
      // Remove any BOM (Byte Order Mark) and normalize line endings
      const cleanText = text
        .replace(/^\uFEFF/, '')  // Remove BOM if present
        .replace(/\r\n/g, '\n')  // Normalize Windows line endings
        .replace(/\r/g, '\n');   // Normalize Mac line endings
      
      return cleanText;
    } catch (error) {
      throw new Error(`TXT parsing error: ${(error as Error).message}`);
    }
  }