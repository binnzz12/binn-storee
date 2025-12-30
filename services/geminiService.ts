import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSupportResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are a helpful customer support agent for "AM Premium Store". 
        We sell Alight Motion Premium subscriptions.
        Key Info:
        - Delivery is instant via email.
        - Payment is real-time.
        - We support XML imports and No Watermark.
        - If payment fails, tell them to check their internet.
        - Keep answers short, friendly, and use Indonesian language (Bahasa Indonesia).`,
      },
    });
    return response.text || "Maaf, saya tidak bisa menjawab saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, layanan support sedang sibuk. Coba lagi nanti.";
  }
};