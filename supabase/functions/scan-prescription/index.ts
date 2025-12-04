import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    console.log('Scanning prescription image...');

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    const systemPrompt = `You are a pharmaceutical AI assistant that analyzes prescription images and medicine strips.
    Extract and analyze the medication information from the image.
    
    For each medication found, provide:
    1. Medicine name
    2. Dosage
    3. Frequency (how often to take)
    4. Purpose/what it treats
    5. Common side effects (2-3 main ones)
    6. Important warnings or interactions
    7. Natural alternatives or complementary remedies (if applicable)
    
    Respond in JSON format:
    {
      "medications": [
        {
          "name": "Medicine name",
          "dosage": "Dosage amount",
          "frequency": "How often to take",
          "purpose": "What it treats",
          "sideEffects": ["Side effect 1", "Side effect 2"],
          "warnings": "Important warnings",
          "naturalAlternatives": ["Alternative 1", "Alternative 2"]
        }
      ],
      "generalAdvice": "General advice about the prescription",
      "disclaimer": "Reminder this is informational only"
    }
    
    If you cannot read the prescription clearly, indicate what parts are unclear.
    Always emphasize this is educational information and to follow doctor's instructions.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Please analyze this prescription or medicine image and provide detailed information about the medications.' },
              { 
                type: 'image_url', 
                image_url: { 
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` 
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scan-prescription function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
