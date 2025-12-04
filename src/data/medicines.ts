export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: string;
  activeIngredient: string;
  purpose: string;
  howItWorks: string;
  dosageInfo: {
    adult: string;
    child: string;
    maxDailyDose: string;
  };
  sideEffects: {
    common: string[];
    serious: string[];
  };
  contraindications: string[];
  pregnancySafety: string;
  breastfeedingSafety: string;
  foodInteractions: string[];
  drugInteractions: string[];
  naturalAlternatives: string[];
}

export const medicines: Medicine[] = [
  {
    id: "lisinopril",
    name: "Lisinopril",
    genericName: "Zestril",
    brandNames: ["Zestril", "Prinivil"],
    category: "ACE Inhibitor",
    activeIngredient: "Lisinopril",
    purpose: "High Blood Pressure",
    howItWorks: "Lisinopril is an ACE inhibitor used to treat high blood pressure (hypertension). Lowering high blood pressure helps prevent strokes, heart attacks, and kidney problems. It works by relaxing blood vessels so that blood can flow more easily.",
    dosageInfo: {
      adult: "10-40mg once daily",
      child: "Consult doctor",
      maxDailyDose: "80mg"
    },
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
      serious: ["Angioedema (swelling)", "High potassium", "Kidney problems"]
    },
    contraindications: ["Pregnancy", "History of angioedema", "Bilateral renal artery stenosis"],
    pregnancySafety: "Not Safe - Category D",
    breastfeedingSafety: "Use with caution",
    foodInteractions: ["High potassium foods", "Salt substitutes"],
    drugInteractions: ["NSAIDs", "Potassium supplements", "Lithium"],
    naturalAlternatives: ["Hibiscus tea", "Garlic", "Omega-3 fatty acids", "Magnesium"]
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    genericName: "Advil",
    brandNames: ["Advil", "Motrin", "Brufen"],
    category: "NSAID",
    activeIngredient: "Ibuprofen",
    purpose: "Pain & Inflammation",
    howItWorks: "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces pain, fever, and inflammation by blocking the production of prostaglandins.",
    dosageInfo: {
      adult: "200-400mg every 4-6 hours",
      child: "5-10mg/kg every 6-8 hours",
      maxDailyDose: "1200mg (OTC), 3200mg (prescription)"
    },
    sideEffects: {
      common: ["Stomach upset", "Nausea", "Dizziness", "Headache"],
      serious: ["GI bleeding", "Kidney damage", "Heart attack risk (prolonged use)"]
    },
    contraindications: ["Active GI bleeding", "Severe kidney disease", "Heart failure"],
    pregnancySafety: "Use with Caution - Avoid in 3rd trimester",
    breastfeedingSafety: "Generally Safe",
    foodInteractions: ["Alcohol", "Take with food to reduce stomach upset"],
    drugInteractions: ["Blood thinners", "ACE inhibitors", "Lithium", "Aspirin"],
    naturalAlternatives: ["Turmeric", "Ginger", "Willow bark", "Boswellia"]
  },
  {
    id: "metformin",
    name: "Metformin",
    genericName: "Glucophage",
    brandNames: ["Glucophage", "Fortamet", "Riomet"],
    category: "Antidiabetic",
    activeIngredient: "Metformin Hydrochloride",
    purpose: "Type 2 Diabetes",
    howItWorks: "Metformin lowers blood sugar by decreasing glucose production in the liver and improving insulin sensitivity in muscle cells.",
    dosageInfo: {
      adult: "500-1000mg twice daily with meals",
      child: "For ages 10+: 500mg twice daily",
      maxDailyDose: "2550mg"
    },
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
      serious: ["Lactic acidosis (rare)", "Vitamin B12 deficiency"]
    },
    contraindications: ["Severe kidney disease", "Liver disease", "Alcoholism"],
    pregnancySafety: "Generally Safe - Category B",
    breastfeedingSafety: "Generally Safe",
    foodInteractions: ["Alcohol (increases lactic acidosis risk)", "Take with meals"],
    drugInteractions: ["Contrast dyes", "Certain diuretics", "Steroids"],
    naturalAlternatives: ["Berberine", "Cinnamon", "Fenugreek", "Bitter melon"]
  },
  {
    id: "atorvastatin",
    name: "Atorvastatin",
    genericName: "Lipitor",
    brandNames: ["Lipitor", "Torvast"],
    category: "Statin",
    activeIngredient: "Atorvastatin Calcium",
    purpose: "High Cholesterol",
    howItWorks: "Atorvastatin lowers LDL cholesterol by inhibiting HMG-CoA reductase, an enzyme involved in cholesterol production in the liver.",
    dosageInfo: {
      adult: "10-80mg once daily",
      child: "10-20mg for ages 10-17",
      maxDailyDose: "80mg"
    },
    sideEffects: {
      common: ["Muscle pain", "Joint pain", "Diarrhea", "Nausea"],
      serious: ["Rhabdomyolysis (muscle breakdown)", "Liver damage", "Memory problems"]
    },
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding"],
    pregnancySafety: "Not Safe - Category X",
    breastfeedingSafety: "Not Safe",
    foodInteractions: ["Grapefruit juice", "High-fat meals"],
    drugInteractions: ["Fibrates", "Niacin", "Certain antibiotics", "HIV medications"],
    naturalAlternatives: ["Red yeast rice", "Plant sterols", "Omega-3s", "Garlic"]
  },
  {
    id: "omeprazole",
    name: "Omeprazole",
    genericName: "Prilosec",
    brandNames: ["Prilosec", "Losec", "Omez"],
    category: "Proton Pump Inhibitor",
    activeIngredient: "Omeprazole",
    purpose: "Acid Reflux & Ulcers",
    howItWorks: "Omeprazole reduces stomach acid production by blocking the proton pump in stomach lining cells.",
    dosageInfo: {
      adult: "20-40mg once daily before meals",
      child: "Weight-based dosing",
      maxDailyDose: "40mg (OTC), 120mg (prescription for specific conditions)"
    },
    sideEffects: {
      common: ["Headache", "Nausea", "Diarrhea", "Stomach pain"],
      serious: ["Bone fractures (long-term)", "Vitamin B12 deficiency", "Kidney problems"]
    },
    contraindications: ["Known hypersensitivity", "Concurrent rilpivirine use"],
    pregnancySafety: "Generally Safe - Category C",
    breastfeedingSafety: "Use with caution",
    foodInteractions: ["Take before meals", "Avoid high-fat foods"],
    drugInteractions: ["Clopidogrel", "Methotrexate", "Certain antifungals"],
    naturalAlternatives: ["DGL licorice", "Slippery elm", "Aloe vera juice", "Ginger"]
  },
  {
    id: "cetirizine",
    name: "Cetirizine",
    genericName: "Zyrtec",
    brandNames: ["Zyrtec", "Reactine", "Alerid"],
    category: "Antihistamine",
    activeIngredient: "Cetirizine Hydrochloride",
    purpose: "Allergies",
    howItWorks: "Cetirizine blocks histamine receptors, reducing allergy symptoms like sneezing, itching, and runny nose.",
    dosageInfo: {
      adult: "10mg once daily",
      child: "2.5-5mg for ages 2-6",
      maxDailyDose: "10mg"
    },
    sideEffects: {
      common: ["Drowsiness", "Dry mouth", "Fatigue", "Headache"],
      serious: ["Severe allergic reaction (rare)", "Difficulty urinating"]
    },
    contraindications: ["Severe kidney disease", "Known hypersensitivity"],
    pregnancySafety: "Generally Safe - Category B",
    breastfeedingSafety: "Use with caution",
    foodInteractions: ["Alcohol may increase drowsiness"],
    drugInteractions: ["CNS depressants", "Theophylline"],
    naturalAlternatives: ["Quercetin", "Butterbur", "Stinging nettle", "Local honey"]
  }
];

export const drugInteractions = [
  {
    medicineA: "Lisinopril",
    medicineB: "Ibuprofen",
    severity: "moderate",
    interactionType: "Reduced Effectiveness",
    description: "NSAIDs can reduce the blood pressure lowering effects of ACE inhibitors and may increase kidney damage risk.",
    whatHappens: "Blood pressure may not be well controlled; kidney function may decline.",
    recommendation: "Consult your doctor before taking them together. Monitor blood pressure and kidney function."
  },
  {
    medicineA: "Metformin",
    medicineB: "Alcohol",
    severity: "moderate",
    interactionType: "Increased Risk",
    description: "Alcohol increases the risk of lactic acidosis when taking Metformin.",
    whatHappens: "May cause dangerous buildup of lactic acid in the blood.",
    recommendation: "Limit alcohol consumption. Avoid binge drinking. Seek medical help if experiencing muscle pain, weakness, or difficulty breathing."
  },
  {
    medicineA: "Atorvastatin",
    medicineB: "Grapefruit",
    severity: "moderate",
    interactionType: "Increased Side Effects",
    description: "Grapefruit inhibits the enzyme that breaks down atorvastatin, leading to higher drug levels.",
    whatHappens: "Increased risk of muscle pain and potentially dangerous muscle breakdown.",
    recommendation: "Avoid grapefruit and grapefruit juice while taking atorvastatin."
  }
];

export const getMedicineById = (id: string) => medicines.find(m => m.id === id);
