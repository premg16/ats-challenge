import { parseDocx } from '@/lib/parsers/docx-parser';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';

// Mock the langchain loader
jest.mock('@langchain/community/document_loaders/fs/docx', () => ({
  DocxLoader: jest.fn()
}));

describe('DOCX Parser', () => {
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

  it('should parse DOCX content correctly', async () => {
    // Setup mock loader
    const mockDocs = [
      { pageContent: 'Document paragraph 1' },
      { pageContent: 'Document paragraph 2' }
    ];
    const mockLoad = jest.fn().mockResolvedValue(mockDocs);
    (DocxLoader as unknown as jest.Mock).mockImplementation(() => ({
      load: mockLoad
    }));
    
    // Create a mock DOCX file
    const file = createMockFile('sample.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // Call the parser
    const result = await parseDocx(file);
    
    // Verify the loader was called with the file
    expect(DocxLoader).toHaveBeenCalledWith(file);
    expect(mockLoad).toHaveBeenCalled();
    
    // Verify the result
    expect(result).toBe('Document paragraph 1\nDocument paragraph 2');
  });

  it('should throw an error when DocxLoader fails with Error object', async () => {
    // Setup mock loader to throw an error
    const mockError = new Error('DOCX loading failed');
    const mockLoad = jest.fn().mockRejectedValue(mockError);
    (DocxLoader as unknown as jest.Mock).mockImplementation(() => ({
      load: mockLoad
    }));
    
    // Create a mock DOCX file
    const file = createMockFile('error.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // Expect the function to throw
    await expect(parseDocx(file)).rejects.toThrow('DOCX parsing error: DOCX loading failed');
  });

  it('should throw an error when DocxLoader fails with non-Error object', async () => {
    // Setup mock loader to throw a string error
    const mockLoad = jest.fn().mockRejectedValue('String error message');
    (DocxLoader as unknown as jest.Mock).mockImplementation(() => ({
      load: mockLoad
    }));
    
    // Create a mock DOCX file
    const file = createMockFile('error.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    // Expect the function to throw
    await expect(parseDocx(file)).rejects.toThrow('DOCX parsing error: String error message');
  });
});