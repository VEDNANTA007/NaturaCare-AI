import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Remedy {
  name: string;
  ingredients: string[];
  category: string;
}

function buildPrecisePrompt(remedy: Remedy): string {
  const name = remedy.name.toLowerCase();
  const ingredients = remedy.ingredients.join(", ").toLowerCase();
  
  let prompt = "";
  
  // TEA/CHAI REMEDIES
  if (name.includes("tea") || name.includes("chai") || name.includes("kadha")) {
    const color = getTeaColor(name, ingredients);
    prompt = `Professional food photography of ${remedy.name}. `;
    prompt += `A clear glass cup filled with ${color} tea on a wooden coaster. `;
    prompt += `Fresh ingredients visible: ${ingredients}. `;
    prompt += `Ingredients artfully arranged beside the cup: `;
    
    if (ingredients.includes("ginger")) prompt += `fresh ginger root (sliced and whole), `;
    if (ingredients.includes("turmeric")) prompt += `turmeric root and powder in small bowl, `;
    if (ingredients.includes("honey")) prompt += `honey in glass jar with wooden dipper, `;
    if (ingredients.includes("lemon")) prompt += `fresh lemon slices and whole lemon, `;
    if (ingredients.includes("tulsi")) prompt += `fresh green tulsi leaves, `;
    if (ingredients.includes("cinnamon")) prompt += `cinnamon sticks, `;
    if (ingredients.includes("mint") || ingredients.includes("pudina")) prompt += `fresh mint leaves, `;
    if (ingredients.includes("fennel") || ingredients.includes("saunf")) prompt += `fennel seeds in small bowl, `;
    if (ingredients.includes("chamomile")) prompt += `dried chamomile flowers, `;
    
    prompt += `Steam rising from the hot tea. Warm natural lighting. Rustic wooden table background. `;
  }
  
  // STEAM INHALATION REMEDIES
  else if (name.includes("steam") || name.includes("bhap") || name.includes("inhalation")) {
    prompt = `Professional photograph of steam inhalation setup for ${remedy.name}. `;
    prompt += `Large ceramic bowl filled with hot steaming water. `;
    
    if (ingredients.includes("tulsi")) prompt += `Fresh green tulsi leaves floating in the water. `;
    if (ingredients.includes("eucalyptus")) prompt += `Eucalyptus leaves and oil drops visible. `;
    if (ingredients.includes("mint")) prompt += `Fresh mint leaves in the water. `;
    if (ingredients.includes("ajwain")) prompt += `Ajwain (carom seeds) scattered in water. `;
    
    prompt += `White towel draped beside the bowl. Steam visibly rising. `;
    prompt += `Additional fresh ingredients arranged around bowl. Clean white background. Natural lighting.`;
  }
  
  // OIL/TOPICAL REMEDIES
  else if (name.includes("oil") || name.includes("roll-on") || name.includes("balm")) {
    prompt = `Professional product photography of ${remedy.name}. `;
    
    if (name.includes("peppermint")) {
      prompt += `Small amber glass roller bottle with metal rollerball top. `;
      prompt += `Fresh peppermint leaves arranged around bottle. `;
      prompt += `Peppermint essential oil visible in bottle (clear with slight green tint). `;
    } else if (name.includes("clove")) {
      prompt += `Small dark glass dropper bottle. `;
      prompt += `Whole cloves scattered around bottle. Clove buds clearly visible. `;
    } else if (name.includes("coconut")) {
      prompt += `Glass jar with coconut oil (white/clear). `;
      prompt += `Fresh coconut pieces, coconut shell half beside jar. `;
    } else {
      prompt += `Small amber glass dropper bottle. `;
      prompt += `Essential oil ingredients arranged around bottle. `;
    }
    
    prompt += `Clean white marble surface. Soft natural lighting. Professional wellness product style.`;
  }
  
  // POWDER REMEDIES
  else if (name.includes("powder") || name.includes("churna")) {
    prompt = `Professional photograph of ${remedy.name}. `;
    prompt += `Wooden bowl containing fine powder. `;
    
    if (name.includes("triphala")) {
      prompt += `Brownish-green powder (Triphala). Three dried fruits (amla, haritaki, bibhitaki) beside bowl. `;
    } else if (name.includes("turmeric")) {
      prompt += `Bright yellow-orange turmeric powder. Fresh turmeric roots beside bowl. `;
    } else if (name.includes("amla")) {
      prompt += `Light greenish-brown amla powder. Fresh amla fruits beside bowl. `;
    }
    
    prompt += `Wooden spoon with powder. Natural ingredients visible. Rustic wooden background.`;
  }
  
  // MILK-BASED REMEDIES
  else if (name.includes("milk") || name.includes("doodh")) {
    prompt = `Professional food photography of ${remedy.name}. `;
    prompt += `Glass of warm milk (creamy white/golden color). `;
    
    if (name.includes("turmeric") || name.includes("haldi")) {
      prompt += `Golden yellow turmeric milk in glass. Turmeric powder and root beside glass. `;
    } else if (name.includes("ashwagandha")) {
      prompt += `Warm milk with light brown tint. Ashwagandha root and powder visible. `;
    } else if (name.includes("saffron") || name.includes("kesar")) {
      prompt += `Milk with golden-yellow hue. Saffron threads floating on top and beside glass. `;
    }
    
    prompt += `Served in clear glass on wooden coaster. Ingredients artfully arranged. Warm lighting.`;
  }
  
  // WATER-BASED DRINKS
  else if (name.includes("water") || name.includes("pani")) {
    prompt = `Professional photograph of ${remedy.name}. `;
    prompt += `Clear glass filled with infused water. `;
    
    if (name.includes("jeera") || name.includes("cumin")) {
      prompt += `Light brown cumin water. Cumin seeds floating and in small bowl beside glass. `;
    } else if (name.includes("ajwain")) {
      prompt += `Clear water with ajwain seeds visible. Ajwain seeds scattered beside glass. `;
    } else if (name.includes("lemon")) {
      prompt += `Clear water with lemon slices. Fresh lemon halves beside glass. `;
    } else if (name.includes("honey")) {
      prompt += `Clear water with honey swirl. Honey jar with dipper beside glass. `;
    }
    
    prompt += `Ice cubes optional. Fresh ingredients beside glass. Clean bright background.`;
  }
  
  // TINCTURE/EXTRACT REMEDIES
  else if (name.includes("tincture") || name.includes("extract")) {
    prompt = `Professional photograph of ${remedy.name}. `;
    
    if (name.includes("echinacea")) {
      prompt += `Dark amber dropper bottle. Fresh purple echinacea flowers (cone flowers) around bottle. `;
    } else if (name.includes("giloy")) {
      prompt += `Green-brown tincture in glass bottle. Fresh giloy stems and leaves beside bottle. `;
    } else {
      prompt += `Dark amber dropper bottle with herbal tincture. `;
    }
    
    prompt += `Dropper clearly visible. Botanical ingredients fresh and vibrant. Clean setup.`;
  }
  
  // JUICE/FRESH DRINK
  else if (name.includes("juice") || name.includes("ras")) {
    prompt = `Professional food photography of fresh ${remedy.name}. `;
    prompt += `Glass filled with fresh juice. `;
    
    if (name.includes("aloe vera")) {
      prompt += `Clear/slightly green aloe vera juice. Fresh aloe vera leaf and gel beside glass. `;
    } else if (name.includes("amla")) {
      prompt += `Light green amla juice. Fresh amla fruits beside glass. `;
    } else if (name.includes("karela") || name.includes("bitter gourd")) {
      prompt += `Green bitter gourd juice. Fresh bitter gourd sliced beside glass. `;
    }
    
    prompt += `Fresh ingredients prominently displayed. Vibrant colors. Natural lighting.`;
  }
  
  // DEFAULT FOR UNMATCHED TYPES
  else {
    prompt = `Professional photograph of ${remedy.name} natural remedy. `;
    prompt += `Main preparation shown clearly in appropriate container. `;
    prompt += `All ingredients visibly arranged: ${ingredients}. `;
    prompt += `Natural, warm lighting. Clean, appealing presentation. `;
    prompt += `Wellness and healing aesthetic. `;
  }
  
  // UNIVERSAL SUFFIXES FOR ALL IMAGES
  prompt += ` High resolution, sharp focus, professional food/wellness photography. `;
  prompt += `NO text, NO labels, NO watermarks, NO people's faces. `;
  prompt += `Photorealistic style. Warm, inviting, natural aesthetic. `;
  prompt += `Clean composition with proper depth of field.`;
  
  return prompt;
}

function getTeaColor(name: string, ingredients: string): string {
  if (name.includes("turmeric") || name.includes("haldi")) return "golden yellow";
  if (name.includes("green tea")) return "light green";
  if (name.includes("black tea")) return "dark brown";
  if (name.includes("chamomile")) return "pale yellow";
  if (name.includes("hibiscus")) return "deep red";
  if (name.includes("tulsi")) return "light brown with green tint";
  if (name.includes("ginger")) return "light brown-amber";
  if (name.includes("lemon")) return "pale yellow";
  if (name.includes("mint")) return "light green-brown";
  if (name.includes("cinnamon")) return "reddish-brown";
  return "warm amber";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { remedy, remedyId } = await req.json();
    
    if (!remedy || !remedy.name) {
      return new Response(
        JSON.stringify({ error: 'Remedy data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating image for remedy: ${remedy.name}`);
    
    const prompt = buildPrecisePrompt(remedy);
    console.log(`Generated prompt: ${prompt.substring(0, 200)}...`);

    // Use gpt-image-1 for high-quality image generation
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'medium',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const base64Image = data.data[0].b64_json;
    
    // If remedyId is provided, upload to Supabase Storage
    if (remedyId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Convert base64 to Uint8Array
      const binaryString = atob(base64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileName = `remedy-${remedyId}-${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('remedy-images')
        .upload(fileName, bytes, {
          contentType: 'image/png',
          cacheControl: '31536000',
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Failed to upload image', details: uploadError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: urlData } = supabase.storage
        .from('remedy-images')
        .getPublicUrl(fileName);

      // Update the remedy record with the new image URL
      const { error: updateError } = await supabase
        .from('natural_remedies')
        .update({ image_url: urlData.publicUrl })
        .eq('id', remedyId);

      if (updateError) {
        console.error('Database update error:', updateError);
      }

      console.log(`Image uploaded successfully for ${remedy.name}: ${urlData.publicUrl}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: urlData.publicUrl,
          message: `Image generated and uploaded for ${remedy.name}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return base64 image if no remedyId provided
    return new Response(
      JSON.stringify({ 
        success: true, 
        image: `data:image/png;base64,${base64Image}`,
        message: `Image generated for ${remedy.name}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating remedy image:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
