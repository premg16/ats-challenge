import { parseCV } from '@/lib/parsers/index';
import { parsePDF } from '@/lib/parsers/pdf-parser';
import { parseDocx } from '@/lib/parsers/docx-parser';
import { parseTxt } from '@/lib/parsers/txt-parser';

// Mock the individual parsers
jest.mock('@/lib/parsers/pdf-parser', () => ({
  parsePDF: jest.fn()
}));

jest.mock('@/lib/parsers/docx-parser', () => ({
  parseDocx: jest.fn()
}));

jest.mock('@/lib/parsers/txt-parser', () => ({
  parseTxt: jest.fn()
}));

describe('CV Parser', () => {
  // Helper function to create a mock File
  function createMockFile(name: string, type: string) {
    return {
      name,
      type
    } as unknown as File;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call parsePDF for PDF files', async () => {
    // Setup mock parser
    const expectedResult = 'Parsed PDF content';
    (parsePDF as jest.Mock).mockResolvedValue(expectedResult);
    
    // Create a mock PDF file
    const file = createMockFile('resume.pdf', 'application/pdf');
    
    // Call the parser
    const result = await parseCV(file);
    
    // Verify the correct parser was called
    expect(parsePDF).toHaveBeenCalledWith(file);
    expect(parseDocx).not.toHaveBeenCalled();
    expect(parseTxt).not.toHaveBeenCalled();
    
    // Verify the result
    expect(result).toBe(expectedResult);
  });

  it('should call parseDocx for DOCX files', async () => {
    // Setup mock parser
    const expectedResult = 'Parsed DOCX content';
    (parseDocx as jest.Mock).mockResolvedValue(expectedResult);
    
    // Create a mock DOCX file
    const file = createMockFile('resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // Call the parser
    const result = await parseCV(file);
    
    // Verify the correct parser was called
    expect(parseDocx).toHaveBeenCalledWith(file);
    expect(parsePDF).not.toHaveBeenCalled();
    expect(parseTxt).not.toHaveBeenCalled();
    
    // Verify the result
    expect(result).toBe(expectedResult);
  });

  it('should call parseTxt for TXT files', async () => {
    // Setup mock parser
    const expectedResult = 'Parsed TXT content';
    (parseTxt as jest.Mock).mockResolvedValue(expectedResult);
    
    // Create a mock TXT file
    const file = createMockFile('resume.txt', 'text/plain');
    
    // Call the parser
    const result = await parseCV(file);
    
    // Verify the correct parser was called
    expect(parseTxt).toHaveBeenCalledWith(file);
    expect(parsePDF).not.toHaveBeenCalled();
    expect(parseDocx).not.toHaveBeenCalled();
    
    // Verify the result
    expect(result).toBe(expectedResult);
  });

  it('should throw an error for unsupported file types', async () => {
    // Create a mock unsupported file
    const file = createMockFile('resume.jpg', 'image/jpeg');
    
    // Expect the function to throw
    await expect(parseCV(file)).rejects.toThrow('CV parsing error: Unsupported file type');
  });

  it('should propagate errors from individual parsers', async () => {
    // Setup mock parser to throw an error
    (parsePDF as jest.Mock).mockRejectedValue(new Error('PDF parsing failed'));
    
    // Create a mock PDF file
    const file = createMockFile('resume.pdf', 'application/pdf');
    
    // Expect the function to throw
    await expect(parseCV(file)).rejects.toThrow('CV parsing error: PDF parsing failed');
  });

  it('should handle non-Error objects thrown by parsers', async () => {
    // Setup mock parser to throw a string
    (parsePDF as jest.Mock).mockRejectedValue('String error');
    
    // Create a mock PDF file
    const file = createMockFile('resume.pdf', 'application/pdf');
    
    // Expect the function to throw
    await expect(parseCV(file)).rejects.toThrow('CV parsing error: String error');
  });
});