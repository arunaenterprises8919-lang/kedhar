import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getProductInfo(barcode: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find detailed information for the product with barcode: ${barcode}. 
      Focus on providing:
      1. Product Name and Brand
      2. Current prices in India across major retailers (Amazon.in, Flipkart, BigBasket, Reliance Digital, Blinkit, Zepto, etc.)
      3. Key specifications or features
      4. A brief summary of the product.
      
      If the barcode is for a specific Indian product, please mention its MRP if available.
      Format the response in clear Markdown with headings.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Error fetching product info:", error);
    throw error;
  }
}
