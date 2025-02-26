import { Gemini } from "../ai/gemini";
import { OpenAI } from "../ai/openai";
import { CV_EXTRACTION_PROMPT } from "../prompts";

export async function extractDetails(
  text: string,
  provider: "openai" | "gemini"
): Promise<any> {
  switch (provider) {
    case "openai":
      return OpenAI(CV_EXTRACTION_PROMPT, text);
    case "gemini":
      return Gemini(CV_EXTRACTION_PROMPT, text);
    default:
      throw new Error("Invalid provider");
  }
}
