"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { geminiApiKey, geminiModel } from "../constants";

export async function Gemini(
    system_prompt: string,
    text: string,
): Promise<any> {
    try {
        const model = new ChatGoogleGenerativeAI({
            apiKey: geminiApiKey,
            modelName: geminiModel,
        });

        const systemMessage = new SystemMessage(system_prompt);
        const userMessage = new HumanMessage(text);

        // Get the response from Gemini
        const response = await model.invoke([systemMessage, userMessage]);
        const response_str = response.content.toString();

        // Extract JSON from the response, handling different formats
        let jsonData;

        try {
            // Case 1: Response is already a valid JSON string
            jsonData = JSON.parse(response_str);
        } catch (parseError) {
            // Case 2: JSON is wrapped in markdown code blocks (```json ... ```)
            const jsonMatch = response_str.match(
                /```(?:json)?\s*([\s\S]*?)\s*```/,
            );

            if (jsonMatch && jsonMatch[1]) {
                try {
                    jsonData = JSON.parse(jsonMatch[1]);
                } catch (nestedError) {
                    // Case 3: Try to find any JSON-like structure in the text
                    const possibleJson = response_str.match(/(\{[\s\S]*\})/);
                    if (possibleJson && possibleJson[1]) {
                        try {
                            jsonData = JSON.parse(possibleJson[1]);
                        } catch (finalError) {
                            throw new Error(
                                "Failed to parse JSON from response",
                            );
                        }
                    } else {
                        throw new Error("No JSON structure found in response");
                    }
                }
            } else {
                throw new Error("No code block found in response");
            }
        }
        return jsonData;
    } catch (error) {
        console.error("Error extracting:", error);
        throw new Error(`Extraction error: ${(error as Error).message}`);
    }
}
