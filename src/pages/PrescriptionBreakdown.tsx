import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Pill, ArrowRight, Leaf } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { medicines, drugInteractions } from "@/data/medicines";
import { cn } from "@/lib/utils";

const tabs = ["About", "Dosage & Safety", "Side Effects", "Natural Alternatives"];

const MedicineCard = ({ medicine }: { medicine: typeof medicines[0] }) => {
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
      {/* Header - Always Visible */}
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

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5">
              {/* Tabs */}
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

              {/* Tab Content */}
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

const PrescriptionBreakdown = () => {
  const displayMedicines = medicines.slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
            Your Prescription Breakdown
          </h1>

          {/* Medicine Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {displayMedicines.slice(0, 2).map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
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
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrescriptionBreakdown;
