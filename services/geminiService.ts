
import { GoogleGenAI, Type } from "@google/genai";
import { AISummary } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const schema = {
  type: Type.OBJECT,
  properties: {
    locationSummary: {
      type: Type.STRING,
      description: "A summary of the project's geographical location based on public sources.",
    },
    pressReportsSummary: {
      type: Type.STRING,
      description: "A summary of recent press reports or official updates on the project's implementation.",
    },
  },
  required: ['locationSummary', 'pressReportsSummary'],
};

export const generateProjectSummary = async (projectName: string, projectCode: string, projectValue: string): Promise<AISummary> => {
  try {
    const prompt = `
      You are an expert analyst specializing in public infrastructure projects.
      Given the following information about a project in Serbia:
      - Project Name: ${projectName}
      - Project Code: ${projectCode}
      - Estimated Value: ${projectValue}

      Please provide a structured summary in JSON format. The JSON object should have two keys: 'locationSummary' and 'pressReportsSummary'.

      1.  **locationSummary**: A string summarizing if the geographical location of the project can be determined from public web sources. If so, describe the location. If not, state that the location is not clearly specified in public sources.
      2.  **pressReportsSummary**: A string summarizing recent (last 2-3 years) press reports or official updates regarding the project's implementation status, progress, any reported delays, or public reception. If no significant reports are found, state that.

      Do not include any introductory text, explanations, or markdown formatting like \`\`\`json outside of the JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      },
    });
    
    const text = response.text.trim();
    const summary: AISummary = JSON.parse(text);
    return summary;

  } catch (error) {
    console.error("Error generating project summary:", error);
    throw new Error("Failed to generate AI summary. The model may be unavailable or the request could not be processed.");
  }
};
