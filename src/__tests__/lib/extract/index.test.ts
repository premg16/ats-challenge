import { extractDetails } from "@/lib/extract/index";
import { Gemini } from "@/lib/ai/gemini";
import { OpenAI } from "@/lib/ai/openai";
import { CV_EXTRACTION_PROMPT } from "@/lib/prompts";

// Mock the dependencies
jest.mock("@/lib/ai/gemini", () => ({
  Gemini: jest.fn()
}));

jest.mock("@/lib/ai/openai", () => ({
  OpenAI: jest.fn()
}));

describe("extractDetails", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call OpenAI when provider is 'openai'", async () => {
    // Arrange
    const mockText = "Sample CV text";
    const mockResult = { name: "John Doe", skills: ["JavaScript", "TypeScript"] };
    // @ts-ignore
    OpenAI.mockResolvedValue(mockResult);

    // Act
    const result = await extractDetails(mockText, "openai");

    // Assert
    expect(OpenAI).toHaveBeenCalledWith(CV_EXTRACTION_PROMPT, mockText);
    expect(Gemini).not.toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("should call Gemini when provider is 'gemini'", async () => {
    // Arrange
    const mockText = "Sample CV text";
    const mockResult = { name: "Jane Smith", skills: ["Python", "Java"] };
    // @ts-ignore
    Gemini.mockResolvedValue(mockResult);

    // Act
    const result = await extractDetails(mockText, "gemini");

    // Assert
    expect(Gemini).toHaveBeenCalledWith(CV_EXTRACTION_PROMPT, mockText);
    expect(OpenAI).not.toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it("should throw an error when provider is invalid", async () => {
    // Arrange
    const mockText = "Sample CV text";
    
    // Act & Assert
    // @ts-ignore - Intentionally passing an invalid provider for testing
    await expect(extractDetails(mockText, "invalid")).rejects.toThrow("Invalid provider");
    expect(OpenAI).not.toHaveBeenCalled();
    expect(Gemini).not.toHaveBeenCalled();
  });

  it("should handle errors from OpenAI provider", async () => {
    // Arrange
    const mockText = "Sample CV text";
    const mockError = new Error("OpenAI API error");
    // @ts-ignore
    OpenAI.mockRejectedValue(mockError);

    // Act & Assert
    await expect(extractDetails(mockText, "openai")).rejects.toThrow("OpenAI API error");
    expect(OpenAI).toHaveBeenCalledWith(CV_EXTRACTION_PROMPT, mockText);
    expect(Gemini).not.toHaveBeenCalled();
  });

  it("should handle errors from Gemini provider", async () => {
    // Arrange
    const mockText = "Sample CV text";
    const mockError = new Error("Gemini API error");
    // @ts-ignore
    Gemini.mockRejectedValue(mockError);

    // Act & Assert
    await expect(extractDetails(mockText, "gemini")).rejects.toThrow("Gemini API error");
    expect(Gemini).toHaveBeenCalledWith(CV_EXTRACTION_PROMPT, mockText);
    expect(OpenAI).not.toHaveBeenCalled();
  });
});