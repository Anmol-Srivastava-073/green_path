import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const imageData = body?.imageData;

    if (!imageData) {
      return new Response(
        JSON.stringify({ success: false, error: "No image provided" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "GEMINI_API_KEY not set" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ------------------------------------------------------------------
    //  FIX: Switched from 'gemini-pro-vision' to 'gemini-1.5-flash'
    // ------------------------------------------------------------------
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    // Ensure we strip the header if it exists (e.g., "data:image/jpeg;base64,")
                    data: imageData.includes(",") ? imageData.split(",")[1] : imageData,
                  },
                },
                {
                  text: `
                    Analyze this image of waste/trash. 
                    You are an expert in Indian waste segregation rules.
                    
                    Return ONLY raw JSON. Do not use Markdown formatting (no \`\`\`json).
                    The JSON must match this structure exactly:
                    {
                      "recyclable": boolean,
                      "itemName": "Short name of the item",
                      "binType": "Green Bin (Wet) or Blue Bin (Dry) or Hazardous",
                      "tips": ["Tip 1", "Tip 2"]
                    }
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Safety check for the response structure
    const candidate = data.candidates?.[0];
    if (!candidate) {
         throw new Error("No response candidates from Gemini");
    }

    let text = candidate.content?.parts?.[0]?.text;

    // Clean up potential markdown formatting if Gemini ignores instructions
    if (text) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: JSON.parse(text),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("EDGE ERROR:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
