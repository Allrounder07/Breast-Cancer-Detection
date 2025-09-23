
import { GoogleGenAI, Type } from "@google/genai";
import { MockAnalysisResult, AISummary } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI summary will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAISummary = async (
  result: MockAnalysisResult
): Promise<AISummary | null> => {
  if (!API_KEY) {
    return {
        summary: "API Key not configured. AI summary is unavailable.",
        recommendation: "Please consult a healthcare professional for guidance."
    };
  }
  
  const confidencePercent = (result.confidence * 100).toFixed(1);

  const prompt = `A thermogram analysis resulted in a '${result.classification}' classification with a ${confidencePercent}% confidence score. As an AI medical assistant, provide a brief, professional, and reassuring summary. IMPORTANT: This is not a diagnosis. Emphasize that the user must consult a healthcare professional for any medical advice or diagnosis. Do not provide medical advice. Structure the output as the specified JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A brief, professional summary of the analysis result."
            },
            recommendation: {
              type: Type.STRING,
              description: "A clear recommendation to consult a healthcare professional, reinforcing that this is not a diagnosis."
            }
          },
          required: ["summary", "recommendation"]
        }
      }
    });
    
    const jsonText = response.text.trim();
    const parsedResponse: AISummary = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error fetching AI summary from Gemini:", error);
    return {
      summary: "An error occurred while generating the AI summary.",
      recommendation: "Please consult a healthcare professional for guidance."
    };
  }
};
