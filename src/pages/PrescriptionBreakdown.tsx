import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  AlertTriangle, 
  Pill, 
  ArrowRight, 
  Leaf, 
  ArrowLeft,
  Camera,
  Info,
  Clock,
  CheckCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { medicines } from "@/data/medicines";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tabs = ["About", "Dosage & Safety", "Side Effects", "Natural Alternatives"];

// Component for displaying static medicine data
const StaticMedicineCard = ({ medicine }: { medicine: typeof medicines[0] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("About");

  const safetyColor = medicine.pregnancySafety.includes("Not Safe")
    ? "bg-destructive/10 text-destructive border-destructive/20"
    : medicine.pregnancySafety.includes("Caution")
    ? "bg-caution/20 text-disclaimer-text border-caution/30"
    : "bg-herbal/10 text-herbal border-herbal/20";

  return (
    <motion.div
      layout
      className="bg-card rounded-2xl shadow-card overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {medicine.name}{" "}
              <span className="text-muted-foreground font-normal">
                ({medicine.genericName})
              </span>
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                For: {medicine.purpose}
              </span>
              <span className={cn("text-xs px-2 py-1 rounded-full border", safetyColor)}>
                Safety: {medicine.pregnancySafety.includes("Not Safe") ? "Use with Caution" : "Generally Safe"}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5">
              <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors relative",
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId={`tab-${medicine.id}`}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "About" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-muted-foreground">{medicine.howItWorks}</p>
                  </motion.div>
                )}

                {activeTab === "Dosage & Safety" && (
                  <motion.div
                    key="dosage"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div>
                      <h4 className="font-medium mb-1">Recommended Dosage</h4>
                      <p className="text-sm text-muted-foreground">{medicine.dosageInfo.adult}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-destructive mb-1">Maximum Daily Dose</h4>
                      <p className="text-sm text-destructive">{medicine.dosageInfo.maxDailyDose}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Food Interactions</h4>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {medicine.foodInteractions.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === "Side Effects" && (
                  <motion.div
                    key="sideeffects"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-caution" />
                        Common Side Effects
                      </h4>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {medicine.sideEffects.common.map((effect, i) => (
                          <li key={i}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        Serious Side Effects
                      </h4>
                      <ul className="text-sm text-destructive list-disc list-inside">
                        {medicine.sideEffects.serious.map((effect, i) => (
                          <li key={i}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === "Natural Alternatives" && (
                  <motion.div
                    key="natural"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-sm text-muted-foreground mb-3">
                      Natural remedies that may help with similar symptoms:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {medicine.naturalAlternatives.map((alt, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-herbal/10 text-herbal border border-herbal/20"
                        >
                          <Leaf className="w-3 h-3" />
                          {alt}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Component for AI-analyzed medications
const AIAnalyzedMedicationCard = ({ med, index }: { med: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
    >
      {/* Medication Header */}
      <div className="bg-primary/10 p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{med.name}</h2>
            {med.dosage && (
              <p className="text-muted-foreground">{med.dosage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medication Details */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Frequency */}
        {med.frequency && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Frequency</h4>
              <p className="text-sm text-muted-foreground">{med.frequency}</p>
            </div>
          </div>
        )}

        {/* Purpose */}
        {med.purpose && (
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Purpose</h4>
              <p className="text-sm text-muted-foreground">{med.purpose}</p>
            </div>
          </div>
        )}

        {/* Side Effects */}
        {med.sideEffects && med.sideEffects.length > 0 && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-severity-moderate shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">Common Side Effects</h4>
              <div className="flex flex-wrap gap-2">
                {med.sideEffects.map((effect: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-severity-moderate/10 text-severity-moderate rounded-full text-sm"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {med.warnings && (
          <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">Important Warnings</h4>
                <p className="text-sm text-muted-foreground">{med.warnings}</p>
              </div>
            </div>
          </div>
        )}

        {/* Natural Alternatives */}
        {med.naturalAlternatives && med.naturalAlternatives.length > 0 && (
          <div className="bg-primary/5 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Natural Alternatives & Complements</h4>
                <ul className="space-y-1">
                  {med.naturalAlternatives.map((alt: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PrescriptionBreakdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, imagePreview } = location.state || {};
  
  const displayMedicines = medicines.slice(0, 4);
  const hasAIAnalysis = analysis && analysis.medications && analysis.medications.length > 0;

  // If we have AI analysis, show that view
  if (hasAIAnalysis) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/prescriptions")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Scan Another Prescription
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI Prescription Analysis
            </h1>
            <p className="text-muted-foreground">
              Detailed breakdown of your prescription medications
            </p>
          </motion.div>

          {/* Image Preview */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <img
                src={imagePreview}
                alt="Uploaded prescription"
                className="max-h-48 rounded-xl shadow-card"
              />
            </motion.div>
          )}

          {/* General Advice */}
          {analysis.generalAdvice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">General Advice</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.generalAdvice}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Analyzed Medications */}
          <div className="space-y-6 mb-8">
            {analysis.medications.map((med: any, index: number) => (
              <AIAnalyzedMedicationCard key={index} med={med} index={index} />
            ))}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted rounded-xl p-5 mb-8"
          >
            <p className="text-sm text-muted-foreground text-center">
              {analysis.disclaimer || "This AI-generated analysis is for informational purposes only. Always follow your doctor's instructions and consult with a healthcare professional before making any changes to your medication regimen."}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/remedies">
              <Button size="lg" leftIcon={<Leaf className="w-5 h-5" />}>
                Explore Natural Remedies
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Camera className="w-5 h-5" />}
              onClick={() => navigate("/prescriptions")}
            >
              Scan Another Prescription
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Default view with static medicine data
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/prescriptions")}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload a Prescription
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Medicine Reference Library
          </h1>
          <p className="text-muted-foreground mb-8">
            Browse common medications and their natural alternatives. Upload a prescription for personalized AI analysis.
          </p>

          {/* CTA to upload prescription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Camera className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Get Personalized Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your prescription for AI-powered medication breakdown
                  </p>
                </div>
              </div>
              <Link to="/prescriptions">
                <Button>
                  Upload Prescription
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Medicine Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {displayMedicines.slice(0, 2).map((medicine) => (
              <StaticMedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>

          {/* Interaction Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-caution/10 border border-caution/30 rounded-2xl p-5 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-disclaimer-text shrink-0" />
              <div>
                <h3 className="font-semibold text-disclaimer-text">Interaction Warning</h3>
                <p className="text-sm text-muted-foreground">
                  Lisinopril may interact with Ibuprofen. Consult your doctor before taking them together.
                </p>
              </div>
            </div>
            <button className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline whitespace-nowrap">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* More Medicine Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {displayMedicines.slice(2, 4).map((medicine) => (
              <StaticMedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrescriptionBreakdown;
