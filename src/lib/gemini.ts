import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;
export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (prompt: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
};
