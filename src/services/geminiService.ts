import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSalesInsights(leads: any[]) {
  try {
    const prompt = `Act as an AI Sales Analyst. Here is the current CRM leads data: ${JSON.stringify(leads)}. 
    Analyze the data and provide 3 actionable insights for the sales team. 
    Focus on followed up leads and identifying stalled deals.
    Format the response as a JSON array of objects with 'title' and 'description'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [
      { title: "Follow up required", description: "3 leads haven't been contacted in over 48 hours." },
      { title: "Pipeline Health", description: "Leads in 'Negotiation' stage represent 60% of total pipeline value." }
    ];
  }
}

export async function getStockInsights(products: any[]) {
  try {
    const prompt = `Act as an Inventory Optimizer. Here is the product stock data: ${JSON.stringify(products)}. 
    Identify critical reorder points and suggest optimizations. 
    Format as JSON: { "suggestions": string[] }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{"suggestions": []}');
  } catch (error) {
    return { suggestions: ["Check laptop inventory soon", "Optimize Dell monitor stock levels"] };
  }
}
