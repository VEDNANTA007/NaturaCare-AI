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
    const { symptoms, selectedSymptoms } = await req.json();

    console.log('Analyzing symptoms:', { symptoms, selectedSymptoms });

    const allSymptoms = [
      ...(symptoms ? [symptoms] : []),
      ...(selectedSymptoms || [])
    ].join(', ');

    if (!allSymptoms) {
      throw new Error('No symptoms provided');
    }

    const systemPrompt = `You are a knowledgeable healthcare AI assistant specializing in natural remedies and wellness. 
    Analyze the user's symptoms and provide:
    1. A potential condition name (be clear this is NOT a diagnosis)
    2. A severity level: "low", "moderate", or "high"
    3. A brief explanation of what might be causing these symptoms
    4. 3 natural remedies with:
       - title
       - why it helps
       - how to use it
    5. 3 warning signs that should prompt a doctor visit
    
    Always emphasize this is educational information, not medical advice.
    
    Respond in JSON format:
    {
      "condition": "Potential condition name",
      "severity": "low|moderate|high",
      "explanation": "Brief explanation",
      "remedies": [
        {"title": "Remedy name", "why": "Why it helps", "how": "How to use"}
      ],
      "warningsSigns": ["Sign 1", "Sign 2", "Sign 3"],
      "disclaimer": "A brief reminder this is not medical advice"
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `My symptoms are: ${allSymptoms}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-symptoms function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
