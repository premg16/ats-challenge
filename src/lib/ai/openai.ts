"use server"
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { openAIApiKey, openAIModel } from "../constants";

export async function OpenAI(system_prompt:string, text: string): Promise<any> {
  try {
    const model = new ChatOpenAI({
      openAIApiKey: openAIApiKey,
      model: openAIModel,
      temperature: 0,
    });

    const systemMessage = new SystemMessage(system_prompt);
    const userMessage = new HumanMessage(text);

    // Set up the structured output format
    const response = await model.invoke([systemMessage, userMessage], {
      response_format: { type: "json_object" }
    });

    const response_str = response.content.toString()

    // Parse the response content
    return JSON.parse(response_str);
  } catch (error) {
    throw new Error(`OpenAI extraction error: ${(error as Error).message}`);
  }
}