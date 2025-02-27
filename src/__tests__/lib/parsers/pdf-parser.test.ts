import { parseWebPDF, parsePDF } from '@/lib/parsers/pdf-parser';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// Mock the langchain loaders
jest.mock("@langchain/community/document_loaders/web/pdf", () => ({
  WebPDFLoader: jest.fn()
}));

jest.mock("@langchain/community/document_loaders/fs/pdf", () => ({
  PDFLoader: jest.fn()
}));

describe('PDF Parser', () => {
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

  describe('parseWebPDF', () => {
    it('should parse PDF content correctly using WebPDFLoader', async () => {
      // Setup mock loader
      const mockDocs = [
        { pageContent: 'Page 1 content' },
        { pageContent: 'Page 2 content' }
      ];
      const mockLoad = jest.fn().mockResolvedValue(mockDocs);
      (WebPDFLoader as jest.Mock).mockImplementation(() => ({
        load: mockLoad
      }));
      
      // Create a mock PDF file
      const file = createMockFile('sample.pdf', 'application/pdf');
      
      // Call the parser
      const result = await parseWebPDF(file);
      
      // Verify the loader was called with the file
      expect(WebPDFLoader).toHaveBeenCalledWith(file);
      expect(mockLoad).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toBe('Page 1 content\nPage 2 content');
    });

    it('should throw an error when WebPDFLoader fails', async () => {
      // Setup mock loader to throw an error
      const mockError = new Error('PDF loading failed');
      const mockLoad = jest.fn().mockRejectedValue(mockError);
      (WebPDFLoader as jest.Mock).mockImplementation(() => ({
        load: mockLoad
      }));
      
      // Create a mock PDF file
      const file = createMockFile('error.pdf', 'application/pdf');
      
      // Expect the function to throw
      await expect(parseWebPDF(file)).rejects.toThrow('PDF parsing error: PDF loading failed');
    });
  });

  describe('parsePDF', () => {
    it('should parse PDF content correctly using PDFLoader', async () => {
      // Setup mock loader
      const mockDocs = [
        { pageContent: 'Page 1 content' },
        { pageContent: 'Page 2 content' }
      ];
      const mockLoad = jest.fn().mockResolvedValue(mockDocs);
      (PDFLoader as unknown as jest.Mock).mockImplementation(() => ({
        load: mockLoad
      }));
      
      // Create a mock PDF file
      const file = createMockFile('sample.pdf', 'application/pdf');
      
      // Call the parser
      const result = await parsePDF(file);
      
      // Verify the loader was called with the file
      expect(PDFLoader).toHaveBeenCalledWith(file);
      expect(mockLoad).toHaveBeenCalled();
      
      // Verify the result
      expect(result).toBe('Page 1 content\nPage 2 content');
    });

    it('should throw an error when PDFLoader fails', async () => {
      // Setup mock loader to throw an error
      const mockError = new Error('PDF loading failed');
      const mockLoad = jest.fn().mockRejectedValue(mockError);
      (PDFLoader as unknown as jest.Mock).mockImplementation(() => ({
        load: mockLoad
      }));
      
      // Create a mock PDF file
      const file = createMockFile('error.pdf', 'application/pdf');
      
      // Expect the function to throw
      await expect(parsePDF(file)).rejects.toThrow('PDF parsing error: PDF loading failed');
    });
  });
});