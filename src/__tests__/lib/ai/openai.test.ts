import { OpenAI } from '@/lib/ai/openai';
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { openAIApiKey, openAIModel } from "@/lib/constants";

// Mock the dependencies
jest.mock("@langchain/openai", () => ({
  ChatOpenAI: jest.fn()
}));

jest.mock("@langchain/core/messages", () => ({
  SystemMessage: jest.fn(),
  HumanMessage: jest.fn()
}));

jest.mock("@/lib/constants", () => ({
  openAIApiKey: "mock-api-key",
  openAIModel: "mock-model"
}));

describe('OpenAI', () => {
  // Setup common test variables
  const systemPrompt = "You are a helpful assistant";
  const userText = "Tell me about AI";
  const mockJsonResponse = { answer: "AI is a technology that enables machines to mimic human intelligence" };
  
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the SystemMessage and HumanMessage constructors
    (SystemMessage as unknown as jest.Mock).mockImplementation((text) => ({ text, type: 'system' }));
    (HumanMessage as unknown as jest.Mock).mockImplementation((text) => ({ text, type: 'human' }));
  });

  it('should initialize ChatOpenAI with correct parameters', async () => {
    // Setup mock for successful response
    const mockInvoke = jest.fn().mockResolvedValue({
      content: JSON.stringify(mockJsonResponse)
    });
    
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke
    }));

    // Call the function
    await OpenAI(systemPrompt, userText);

    // Verify ChatOpenAI was initialized correctly
    expect(ChatOpenAI).toHaveBeenCalledWith({
      openAIApiKey: openAIApiKey,
      model: openAIModel,
      temperature: 0
    });
  });

  it('should create correct system and user messages', async () => {
    // Setup mock for successful response
    const mockInvoke = jest.fn().mockResolvedValue({
      content: JSON.stringify(mockJsonResponse)
    });
    
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke
    }));

    // Call the function
    await OpenAI(systemPrompt, userText);

    // Verify messages were created correctly
    expect(SystemMessage).toHaveBeenCalledWith(systemPrompt);
    expect(HumanMessage).toHaveBeenCalledWith(userText);
  });

  it('should invoke the model with correct parameters and return parsed JSON', async () => {
    // Setup mock for successful response
    const mockInvoke = jest.fn().mockResolvedValue({
      content: JSON.stringify(mockJsonResponse)
    });
    
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke
    }));

    // Call the function
    const result = await OpenAI(systemPrompt, userText);

    // Verify invoke was called with correct parameters
    expect(mockInvoke).toHaveBeenCalledWith(
      [
        { text: systemPrompt, type: 'system' },
        { text: userText, type: 'human' }
      ],
      { response_format: { type: "json_object" } }
    );

    // Verify the result is correctly parsed
    expect(result).toEqual(mockJsonResponse);
  });

  it('should handle non-JSON responses by throwing an error', async () => {
    // Setup mock for invalid JSON response
    const mockInvoke = jest.fn().mockResolvedValue({
      content: "This is not JSON"
    });
    
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke
    }));

    // Call the function and expect it to throw
    await expect(OpenAI(systemPrompt, userText)).rejects.toThrow(/OpenAI extraction error: .*/);
  });

  it('should propagate errors from the ChatOpenAI invoke method', async () => {
    // Setup mock to throw an error
    const mockError = new Error("API rate limit exceeded");
    const mockInvoke = jest.fn().mockRejectedValue(mockError);
    
    (ChatOpenAI as unknown as jest.Mock).mockImplementation(() => ({
      invoke: mockInvoke
    }));

    // Call the function and expect it to throw with the wrapped error
    await expect(OpenAI(systemPrompt, userText)).rejects.toThrow(
      "OpenAI extraction error: API rate limit exceeded"
    );
  });
});