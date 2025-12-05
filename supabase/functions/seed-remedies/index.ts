import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const remediesData = [
  {
    id: "ginger-turmeric-tea",
    name: "Ginger Turmeric Tea",
    traditional_name: "Haldi Adrak Chai",
    category: "Anti-inflammatory",
    tags: ["Pain Relief", "Inflammation", "Immunity", "Fever"],
    condition_treated: ["Fever", "Body aches", "Cold", "Inflammation"],
    ingredients: [
      "1 inch fresh ginger (grated)",
      "1 tsp turmeric powder",
      "1 cup water",
      "Honey to taste",
      "Pinch of black pepper"
    ],
    preparation_steps: [
      "Boil water in a pan",
      "Add grated ginger and turmeric",
      "Simmer for 5-7 minutes",
      "Strain into a cup",
      "Add honey and black pepper, serve warm"
    ],
    dosage: "1 cup, 2-3 times daily",
    frequency: "Morning and evening",
    duration: "5-7 days",
    why_it_helps: "Ginger contains gingerol and turmeric contains curcumin, both powerful anti-inflammatory compounds that reduce pain and fever naturally.",
    how_it_works: "Inhibits inflammatory enzymes and modulates immune response. Black pepper enhances curcumin absorption by 2000%.",
    evidence_level: "Research-Backed",
    safety_warnings: ["May cause heartburn in some people", "Avoid if on blood thinners"],
    contraindications: ["Bleeding disorders", "Gallstones", "Upcoming surgery"],
    pregnancy_safe: true,
    region: "Pan-India",
    rating: 4.5
  },
  {
    id: "echinacea-tincture",
    name: "Echinacea Tincture",
    category: "Immune Support",
    tags: ["Immunity", "Cold", "Flu", "Prevention"],
    condition_treated: ["Common cold", "Flu", "Upper respiratory infections"],
    ingredients: [
      "Echinacea root or flowers",
      "High-proof alcohol (vodka or brandy)",
      "Glass jar with lid"
    ],
    preparation_steps: [
      "Fill jar 1/3 with dried echinacea or 2/3 with fresh",
      "Cover with alcohol, leaving 1 inch headspace",
      "Seal and store in dark place for 4-6 weeks",
      "Shake daily",
      "Strain and store in dark bottles"
    ],
    dosage: "30-60 drops in water",
    frequency: "3 times daily at first sign of illness",
    duration: "7-10 days maximum",
    why_it_helps: "Echinacea stimulates the immune system and has antiviral properties that help fight off infections.",
    how_it_works: "Increases white blood cell production and activates immune cells to fight pathogens.",
    evidence_level: "Modern Research",
    safety_warnings: ["Not for autoimmune conditions", "May cause allergic reactions in those allergic to daisies"],
    contraindications: ["Autoimmune diseases", "HIV/AIDS", "Tuberculosis"],
    pregnancy_safe: false,
    region: "North America, Europe",
    rating: 4.0
  },
  {
    id: "peppermint-oil",
    name: "Peppermint Oil Roll-On",
    category: "Headache Relief",
    tags: ["Pain Relief", "Headache", "Tension", "Cooling"],
    condition_treated: ["Tension headache", "Migraine", "Muscle tension"],
    ingredients: [
      "10 drops peppermint essential oil",
      "1 oz carrier oil (jojoba or coconut)",
      "Roll-on bottle"
    ],
    preparation_steps: [
      "Add carrier oil to roll-on bottle",
      "Add peppermint essential oil",
      "Shake gently to mix",
      "Apply to temples and back of neck",
      "Avoid eye area"
    ],
    dosage: "Apply diluted oil to temples",
    frequency: "As needed, up to 4 times daily",
    duration: "Use as symptoms occur",
    why_it_helps: "Menthol in peppermint provides cooling sensation and relaxes tense muscles that contribute to headaches.",
    how_it_works: "Menthol activates cold receptors, increases blood flow, and relaxes smooth muscle.",
    evidence_level: "Research-Backed",
    safety_warnings: ["Always dilute before skin application", "Keep away from eyes and mucous membranes"],
    contraindications: ["G6PD deficiency", "Children under 6"],
    pregnancy_safe: false,
    region: "Worldwide",
    rating: 5.0
  },
  {
    id: "chamomile-tea",
    name: "Chamomile Sleep Tea",
    category: "Sleep Aid",
    tags: ["Sleep", "Relaxation", "Anxiety", "Calming"],
    condition_treated: ["Insomnia", "Anxiety", "Restlessness", "Stress"],
    ingredients: [
      "2 tbsp dried chamomile flowers",
      "1 cup boiling water",
      "Honey to taste",
      "Optional: lavender buds"
    ],
    preparation_steps: [
      "Place chamomile in a teapot or cup",
      "Pour boiling water over flowers",
      "Cover and steep for 5-10 minutes",
      "Strain and add honey if desired",
      "Drink 30 minutes before bed"
    ],
    dosage: "1-2 cups",
    frequency: "Before bedtime",
    duration: "Ongoing as needed",
    why_it_helps: "Chamomile contains apigenin, a compound that binds to brain receptors promoting relaxation and sleep.",
    how_it_works: "Apigenin binds to GABA receptors in the brain, producing mild sedative effects.",
    evidence_level: "Research-Backed",
    safety_warnings: ["May cause drowsiness", "Possible allergic reaction if allergic to ragweed"],
    contraindications: ["Ragweed allergy", "Before driving or operating machinery"],
    pregnancy_safe: true,
    region: "Worldwide",
    rating: 4.2
  },
  {
    id: "honey-lemon-water",
    name: "Honey Lemon Water",
    category: "Immunity",
    tags: ["Immunity", "Digestion", "Detox", "Sore Throat"],
    condition_treated: ["Sore throat", "Cold symptoms", "Digestive issues"],
    ingredients: [
      "1 cup warm water",
      "1 tbsp raw honey",
      "Juice of half a lemon"
    ],
    preparation_steps: [
      "Heat water to warm (not boiling)",
      "Squeeze lemon juice into water",
      "Add raw honey and stir well",
      "Drink while warm"
    ],
    dosage: "1 cup",
    frequency: "Morning on empty stomach",
    duration: "Daily for best results",
    why_it_helps: "Honey has antibacterial properties while lemon provides vitamin C and aids digestion.",
    how_it_works: "Honey soothes throat tissue, lemon alkalizes the body and supports immune function.",
    evidence_level: "Traditional Use",
    safety_warnings: ["Not for children under 1 year (honey)", "May affect tooth enamel if taken frequently"],
    contraindications: ["Infants under 1 year", "Citrus allergy"],
    pregnancy_safe: true,
    region: "Worldwide",
    rating: 4.8
  },
  {
    id: "tulsi-steam",
    name: "Tulsi Steam Inhalation",
    category: "Respiratory",
    tags: ["Respiratory", "Congestion", "Cold", "Sinus"],
    condition_treated: ["Nasal congestion", "Sinus issues", "Cold", "Cough"],
    ingredients: [
      "Handful of fresh tulsi (holy basil) leaves",
      "4 cups boiling water",
      "Large bowl",
      "Towel"
    ],
    preparation_steps: [
      "Boil water and pour into large bowl",
      "Add fresh tulsi leaves",
      "Lean over bowl with towel over head",
      "Inhale steam for 10-15 minutes",
      "Keep eyes closed during treatment"
    ],
    dosage: "10-15 minutes inhalation",
    frequency: "2-3 times daily",
    duration: "Until congestion clears",
    why_it_helps: "Tulsi has antimicrobial properties and the steam helps loosen mucus and open airways.",
    how_it_works: "Essential oils in tulsi have antibacterial and antiviral properties; steam moisturizes and clears passages.",
    evidence_level: "Traditional Use",
    safety_warnings: ["Be careful with hot steam to avoid burns", "Not recommended for children without supervision"],
    contraindications: ["Asthma (may trigger in some)", "Very young children"],
    pregnancy_safe: true,
    region: "India",
    rating: 4.6
  },
  {
    id: "triphala-powder",
    name: "Triphala Powder",
    category: "Digestion",
    tags: ["Digestion", "Detox", "Gut Health", "Constipation"],
    condition_treated: ["Constipation", "Digestive issues", "Detoxification"],
    ingredients: [
      "1/2 tsp Triphala powder",
      "1 cup warm water",
      "Optional: honey"
    ],
    preparation_steps: [
      "Add Triphala powder to warm water",
      "Stir well until dissolved",
      "Add honey if desired for taste",
      "Drink on empty stomach"
    ],
    dosage: "1/2 to 1 tsp powder in water",
    frequency: "Once daily, before bed or morning",
    duration: "2-4 weeks, then take a break",
    why_it_helps: "Triphala is a combination of three fruits that gently cleanse the digestive tract and support gut health.",
    how_it_works: "Acts as a mild laxative, supports healthy gut bacteria, and has antioxidant properties.",
    evidence_level: "Research-Backed",
    safety_warnings: ["May cause loose stools initially", "Start with smaller dose"],
    contraindications: ["Pregnancy", "Diarrhea", "Inflammatory bowel disease"],
    pregnancy_safe: false,
    region: "India",
    rating: 4.3
  },
  {
    id: "ashwagandha-milk",
    name: "Ashwagandha Milk",
    category: "Stress Relief",
    tags: ["Stress", "Anxiety", "Sleep", "Energy"],
    condition_treated: ["Stress", "Anxiety", "Fatigue", "Insomnia"],
    ingredients: [
      "1 cup warm milk (dairy or plant-based)",
      "1/2 tsp Ashwagandha powder",
      "1/4 tsp cinnamon",
      "Honey to taste"
    ],
    preparation_steps: [
      "Warm milk in a pan",
      "Add Ashwagandha powder and cinnamon",
      "Stir well and simmer for 2 minutes",
      "Remove from heat and add honey",
      "Drink warm before bed"
    ],
    dosage: "1 cup with 300-500mg Ashwagandha",
    frequency: "Once daily, preferably at night",
    duration: "6-8 weeks for full benefits",
    why_it_helps: "Ashwagandha is an adaptogen that helps the body manage stress and promotes restful sleep.",
    how_it_works: "Reduces cortisol levels, modulates stress response, and promotes GABA activity for relaxation.",
    evidence_level: "Research-Backed",
    safety_warnings: ["May cause drowsiness", "Not for thyroid conditions without doctor's approval"],
    contraindications: ["Pregnancy", "Autoimmune thyroid disease", "Before surgery"],
    pregnancy_safe: false,
    region: "India",
    rating: 4.4
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting to seed remedies data...');

    // Upsert all remedies
    for (const remedy of remediesData) {
      const { error } = await supabase
        .from('natural_remedies')
        .upsert(remedy, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting ${remedy.name}:`, error);
      } else {
        console.log(`Successfully upserted: ${remedy.name}`);
      }
    }

    console.log('Seeding completed!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Seeded ${remediesData.length} remedies successfully`,
        count: remediesData.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding remedies:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to seed remedies', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
