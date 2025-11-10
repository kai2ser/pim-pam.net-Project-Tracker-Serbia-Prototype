
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateProjectSummary = async (projectName: string, projectNameEn: string, projectCode: string, projectValue: string): Promise<string> => {
  try {
    const prompt = `
<project_research_request>
<project_details>
<name>${projectName} (${projectNameEn})</name>
<code>${projectCode}</code>
<estimated_value>${projectValue}</estimated_value>
</project_details>

<instructions>
You are tasked with researching and summarizing publicly available information about the above investment project. Please conduct web searches and provide a concise, structured two-page summary.

Your summary MUST include:

1. PROJECT IDENTIFICATION
   - Confirm project name and any alternative names found
   - Verify the project code if mentioned in sources

2. LOCATION ANALYSIS
   - Determine the specific geographic location (country, region, city/municipality)
   - Identify the project site or corridor if applicable
   - Note any location uncertainty or multiple sites

3. IMPLEMENTATION STATUS & PRESS COVERAGE
   - Identify recent press reports or news articles about the project
   - Summarize implementation status (planning, tendering, construction, completed)
   - Note any reported delays, controversies, or challenges
   - Highlight any reported budget changes vs. the reference estimate of ${projectValue}

4. KEY STAKEHOLDERS
   - Implementing agency or ministry
   - Contractors or developers (if identified)
   - Funding sources (national budget, EU funds, IFI loans, etc.)

5. EXTERNAL FINANCING AND TECHNICAL ASSISTANCE
   - Identify any reference to the project being supported by the European Union (EU), European Commission (EC) or the Western Balkan Investment Facility (WBIF)
   - Identify if the project is being financed by any other partners such as the World Bank Group (WB, WBG), the European Investment Bank (EIB), French Development Agency (Agence française de développement (AFD), or China

6. ECONOMIC & FINANCIAL ANALYSIS
   - Identify any economic and financial analysis (EFA) conducted for this project
   - Identify any references to cost-benefit analysis (CBA) for this project
   - Identify and disclose the Economic Rate of Return (ERR) or Economic Internal Rate of Return (EIIR) for this project

7. LINKS AND REFERENCE
    - Identify the three most relevant and recent reference links available for this project
    - Provide these three links, including URL

<output_format>
Structure your response as follows:
- Use clear section headers
- Keep total response to approximately 400-500 words
- Cite sources with [index] notation
- If information cannot be determined, explicitly state "Not determined from available sources"
- Prioritize recent information (last 2-3 years)
</output_format>

<search_strategy>
- Begin with searches combining project name and code
- Search for project name with terms like "implementation", "construction", "tender"
- Search for location-specific terms if initial searches are inconclusive
- Fetch full articles from credible sources (government sites, major news outlets)
</search_strategy>
</instructions>
</project_research_request>
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.2,
      },
    });
    
    return response.text;

  } catch (error) {
    console.error("Error generating project summary:", error);
    throw new Error("Failed to generate AI summary. The model may be unavailable or the request could not be processed.");
  }
};
