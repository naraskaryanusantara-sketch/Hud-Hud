
import { GoogleGenAI } from "@google/genai";

export const getAiResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "I'm sorry, my connection to the AI service is not configured. Please check the API key.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};
