export interface Remedy {
  id: string;
  name: string;
  traditionalName?: string;
  category: string;
  tags: string[];
  conditionTreated: string[];
  ingredients: string[];
  preparationSteps: string[];
  dosage: string;
  frequency: string;
  duration: string;
  whyItHelps: string;
  howItWorks: string;
  evidenceLevel: "Traditional Use" | "Modern Research" | "Research-Backed";
  safetyWarnings: string[];
  contraindications: string[];
  pregnancySafe: boolean;
  region: string;
  imageUrl: string;
  rating: number;
}

export const remedies: Remedy[] = [
  {
    id: "ginger-turmeric-tea",
    name: "Ginger Turmeric Tea",
    traditionalName: "Haldi Adrak Chai",
    category: "Anti-inflammatory",
    tags: ["Pain Relief", "Inflammation", "Immunity", "Fever"],
    conditionTreated: ["Fever", "Body aches", "Cold", "Inflammation"],
    ingredients: [
      "1 inch fresh ginger (grated)",
      "1 tsp turmeric powder",
      "1 cup water",
      "Honey to taste",
      "Pinch of black pepper"
    ],
    preparationSteps: [
      "Boil water in a pan",
      "Add grated ginger and turmeric",
      "Simmer for 5-7 minutes",
      "Strain into a cup",
      "Add honey and black pepper, serve warm"
    ],
    dosage: "1 cup, 2-3 times daily",
    frequency: "Morning and evening",
    duration: "5-7 days",
    whyItHelps: "Ginger contains gingerol and turmeric contains curcumin, both powerful anti-inflammatory compounds that reduce pain and fever naturally.",
    howItWorks: "Inhibits inflammatory enzymes and modulates immune response. Black pepper enhances curcumin absorption by 2000%.",
    evidenceLevel: "Research-Backed",
    safetyWarnings: [
      "May cause heartburn in some people",
      "Avoid if on blood thinners"
    ],
    contraindications: ["Bleeding disorders", "Gallstones", "Upcoming surgery"],
    pregnancySafe: true,
    region: "Pan-India",
    imageUrl: "/remedies/ginger-tea.jpg",
    rating: 4.5
  },
  {
    id: "echinacea-tincture",
    name: "Echinacea Tincture",
    category: "Immune Support",
    tags: ["Immunity", "Cold", "Flu", "Prevention"],
    conditionTreated: ["Common cold", "Flu", "Upper respiratory infections"],
    ingredients: [
      "Echinacea root or flowers",
      "High-proof alcohol (vodka or brandy)",
      "Glass jar with lid"
    ],
    preparationSteps: [
      "Fill jar 1/3 with dried echinacea or 2/3 with fresh",
      "Cover with alcohol, leaving 1 inch headspace",
      "Seal and store in dark place for 4-6 weeks",
      "Shake daily",
      "Strain and store in dark bottles"
    ],
    dosage: "30-60 drops in water",
    frequency: "3 times daily at first sign of illness",
    duration: "7-10 days maximum",
    whyItHelps: "Echinacea stimulates the immune system and has antiviral properties that help fight off infections.",
    howItWorks: "Increases white blood cell production and activates immune cells to fight pathogens.",
    evidenceLevel: "Modern Research",
    safetyWarnings: [
      "Not for autoimmune conditions",
      "May cause allergic reactions in those allergic to daisies"
    ],
    contraindications: ["Autoimmune diseases", "HIV/AIDS", "Tuberculosis"],
    pregnancySafe: false,
    region: "North America, Europe",
    imageUrl: "/remedies/echinacea.jpg",
    rating: 4.0
  },
  {
    id: "peppermint-oil",
    name: "Peppermint Oil Roll-On",
    category: "Headache Relief",
    tags: ["Pain Relief", "Headache", "Tension", "Cooling"],
    conditionTreated: ["Tension headache", "Migraine", "Muscle tension"],
    ingredients: [
      "10 drops peppermint essential oil",
      "1 oz carrier oil (jojoba or coconut)",
      "Roll-on bottle"
    ],
    preparationSteps: [
      "Add carrier oil to roll-on bottle",
      "Add peppermint essential oil",
      "Shake gently to mix",
      "Apply to temples and back of neck",
      "Avoid eye area"
    ],
    dosage: "Apply diluted oil to temples",
    frequency: "As needed, up to 4 times daily",
    duration: "Use as symptoms occur",
    whyItHelps: "Menthol in peppermint provides cooling sensation and relaxes tense muscles that contribute to headaches.",
    howItWorks: "Menthol activates cold receptors, increases blood flow, and relaxes smooth muscle.",
    evidenceLevel: "Research-Backed",
    safetyWarnings: [
      "Always dilute before skin application",
      "Keep away from eyes and mucous membranes"
    ],
    contraindications: ["G6PD deficiency", "Children under 6"],
    pregnancySafe: false,
    region: "Worldwide",
    imageUrl: "/remedies/peppermint.jpg",
    rating: 5.0
  },
  {
    id: "chamomile-tea",
    name: "Chamomile Sleep Tea",
    category: "Sleep Aid",
    tags: ["Sleep", "Relaxation", "Anxiety", "Calming"],
    conditionTreated: ["Insomnia", "Anxiety", "Restlessness", "Stress"],
    ingredients: [
      "2 tbsp dried chamomile flowers",
      "1 cup boiling water",
      "Honey to taste",
      "Optional: lavender buds"
    ],
    preparationSteps: [
      "Place chamomile in a teapot or cup",
      "Pour boiling water over flowers",
      "Cover and steep for 5-10 minutes",
      "Strain and add honey if desired",
      "Drink 30 minutes before bed"
    ],
    dosage: "1-2 cups",
    frequency: "Before bedtime",
    duration: "Ongoing as needed",
    whyItHelps: "Chamomile contains apigenin, a compound that binds to brain receptors promoting relaxation and sleep.",
    howItWorks: "Apigenin binds to GABA receptors in the brain, producing mild sedative effects.",
    evidenceLevel: "Research-Backed",
    safetyWarnings: [
      "May cause drowsiness",
      "Possible allergic reaction if allergic to ragweed"
    ],
    contraindications: ["Ragweed allergy", "Before driving or operating machinery"],
    pregnancySafe: true,
    region: "Worldwide",
    imageUrl: "/remedies/chamomile.jpg",
    rating: 4.2
  },
  {
    id: "honey-lemon-water",
    name: "Honey Lemon Water",
    category: "Immunity",
    tags: ["Immunity", "Digestion", "Detox", "Sore Throat"],
    conditionTreated: ["Sore throat", "Cold symptoms", "Digestive issues"],
    ingredients: [
      "1 cup warm water",
      "1 tbsp raw honey",
      "Juice of half a lemon"
    ],
    preparationSteps: [
      "Heat water to warm (not boiling)",
      "Squeeze lemon juice into water",
      "Add raw honey and stir well",
      "Drink while warm"
    ],
    dosage: "1 cup",
    frequency: "Morning on empty stomach",
    duration: "Daily for best results",
    whyItHelps: "Honey has antibacterial properties while lemon provides vitamin C and aids digestion.",
    howItWorks: "Honey soothes throat tissue, lemon alkalizes the body and supports immune function.",
    evidenceLevel: "Traditional Use",
    safetyWarnings: [
      "Not for children under 1 year (honey)",
      "May affect tooth enamel if taken frequently"
    ],
    contraindications: ["Infants under 1 year", "Citrus allergy"],
    pregnancySafe: true,
    region: "Worldwide",
    imageUrl: "/remedies/ginger-tea.jpg",
    rating: 4.8
  },
  {
    id: "tulsi-steam",
    name: "Tulsi Steam Inhalation",
    category: "Respiratory",
    tags: ["Respiratory", "Congestion", "Cold", "Sinus"],
    conditionTreated: ["Nasal congestion", "Sinus issues", "Cold", "Cough"],
    ingredients: [
      "Handful of fresh tulsi (holy basil) leaves",
      "4 cups boiling water",
      "Large bowl",
      "Towel"
    ],
    preparationSteps: [
      "Boil water and pour into large bowl",
      "Add fresh tulsi leaves",
      "Lean over bowl with towel over head",
      "Inhale steam for 10-15 minutes",
      "Keep eyes closed during treatment"
    ],
    dosage: "10-15 minutes inhalation",
    frequency: "2-3 times daily",
    duration: "Until congestion clears",
    whyItHelps: "Tulsi has antimicrobial properties and the steam helps loosen mucus and open airways.",
    howItWorks: "Essential oils in tulsi have antibacterial and antiviral properties; steam moisturizes and clears passages.",
    evidenceLevel: "Traditional Use",
    safetyWarnings: [
      "Be careful with hot steam to avoid burns",
      "Not recommended for children without supervision"
    ],
    contraindications: ["Asthma (may trigger in some)", "Very young children"],
    pregnancySafe: true,
    region: "India",
    imageUrl: "/remedies/echinacea.jpg",
    rating: 4.6
  },
  {
    id: "triphala-powder",
    name: "Triphala Powder",
    category: "Digestion",
    tags: ["Digestion", "Detox", "Gut Health", "Constipation"],
    conditionTreated: ["Constipation", "Digestive issues", "Detoxification"],
    ingredients: [
      "1/2 tsp Triphala powder",
      "1 cup warm water",
      "Optional: honey"
    ],
    preparationSteps: [
      "Add Triphala powder to warm water",
      "Stir well until dissolved",
      "Add honey if desired for taste",
      "Drink on empty stomach"
    ],
    dosage: "1/2 to 1 tsp powder in water",
    frequency: "Once daily, before bed or morning",
    duration: "2-4 weeks, then take a break",
    whyItHelps: "Triphala is a combination of three fruits that gently cleanse the digestive tract and support gut health.",
    howItWorks: "Acts as a mild laxative, supports healthy gut bacteria, and has antioxidant properties.",
    evidenceLevel: "Research-Backed",
    safetyWarnings: [
      "May cause loose stools initially",
      "Start with smaller dose"
    ],
    contraindications: ["Pregnancy", "Diarrhea", "Inflammatory bowel disease"],
    pregnancySafe: false,
    region: "India",
    imageUrl: "/remedies/chamomile.jpg",
    rating: 4.3
  },
  {
    id: "ashwagandha-milk",
    name: "Ashwagandha Milk",
    category: "Stress Relief",
    tags: ["Stress", "Anxiety", "Sleep", "Energy"],
    conditionTreated: ["Stress", "Anxiety", "Fatigue", "Insomnia"],
    ingredients: [
      "1 cup warm milk (dairy or plant-based)",
      "1/2 tsp Ashwagandha powder",
      "1/4 tsp cinnamon",
      "Honey to taste"
    ],
    preparationSteps: [
      "Warm milk in a pan",
      "Add Ashwagandha powder and cinnamon",
      "Stir well and simmer for 2 minutes",
      "Remove from heat and add honey",
      "Drink warm before bed"
    ],
    dosage: "1 cup with 300-500mg Ashwagandha",
    frequency: "Once daily, preferably at night",
    duration: "6-8 weeks for full benefits",
    whyItHelps: "Ashwagandha is an adaptogen that helps the body manage stress and promotes restful sleep.",
    howItWorks: "Reduces cortisol levels, modulates stress response, and promotes GABA activity for relaxation.",
    evidenceLevel: "Research-Backed",
    safetyWarnings: [
      "May cause drowsiness",
      "Not for thyroid conditions without doctor's approval"
    ],
    contraindications: ["Pregnancy", "Autoimmune thyroid disease", "Before surgery"],
    pregnancySafe: false,
    region: "India",
    imageUrl: "/remedies/peppermint.jpg",
    rating: 4.4
  }
];

export const getRemedyById = (id: string) => remedies.find(r => r.id === id);

export const getRemediesByCategory = (category: string) => 
  category === "All" ? remedies : remedies.filter(r => r.category === category || r.tags.includes(category));
