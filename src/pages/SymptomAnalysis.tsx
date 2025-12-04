import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Droplet, Leaf, Pill, Calendar, Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const iconMap: Record<string, typeof Droplet> = {
  "Peppermint": Droplet,
  "Hydration": Droplet,
  "Water": Droplet,
  "Rest": Leaf,
  "Sleep": Leaf,
  "Tea": Leaf,
  "Ginger": Leaf,
  "Honey": Leaf,
  "Magnesium": Pill,
  "Vitamin": Pill,
  "Supplement": Pill,
};

const getIconForRemedy = (title: string) => {
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return Icon;
    }
  }
  return Leaf;
};

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "low":
      return "bg-green-500/20 text-green-600";
    case "moderate":
      return "bg-severity-moderate/20 text-severity-moderate";
    case "high":
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-severity-moderate/20 text-severity-moderate";
  }
};

const SymptomAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { symptoms, selectedSymptoms, analysis } = location.state || {};

  useEffect(() => {
    if (!analysis) {
      navigate("/symptom-checker");
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  const remedies = analysis.remedies || [];
  const warningSigns = analysis.warningsSigns || analysis.warningSigns || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/symptom-checker")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Check Different Symptoms
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your AI Symptom Analysis
          </h1>
          <p className="text-muted-foreground">
            Based on: {[...(selectedSymptoms || []), symptoms].filter(Boolean).join(", ")}
          </p>
        </motion.div>

        {/* Main Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-8"
        >
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm uppercase ${getSeverityColor(analysis.severity)}`}>
              <AlertCircle className="w-4 h-4" />
              {analysis.severity} SEVERITY
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {analysis.condition}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-4">
            {analysis.explanation}
          </p>
          <p className="text-sm text-muted-foreground text-center italic">
            {analysis.disclaimer || "This AI-generated summary provides a potential explanation. It is not a medical diagnosis."}
          </p>
        </motion.div>

        {/* Recommended Natural Remedies */}
        {remedies.length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Recommended Natural Remedies
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {remedies.map((remedy: any, index: number) => {
                const Icon = getIconForRemedy(remedy.title);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-card rounded-xl p-5 shadow-card"
                  >
                    <div className="icon-circle icon-circle-teal mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold mb-2">{remedy.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Why it helps:</span> {remedy.why}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">How to use:</span> {remedy.how}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Two Column Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* When to See a Doctor */}
          {warningSigns.length > 0 && (
            <div className="bg-destructive/10 rounded-xl p-5 border border-destructive/20">
              <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                When to See a Doctor
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Seek professional medical advice if you experience any of the following:
              </p>
              <ul className="space-y-2">
                {warningSigns.map((flag: string, index: number) => (
                  <li key={index} className="text-sm text-destructive flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Medicine Support */}
          <div className="bg-muted rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Important Reminder</h3>
            <p className="text-sm text-muted-foreground">
              This analysis is for educational purposes only. Always consult with a healthcare professional before starting any treatment. If symptoms persist or worsen, seek medical attention immediately.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" leftIcon={<Calendar className="w-5 h-5" />}>
            Start a 7-Day Healing Plan
          </Button>
          <Link to="/prescriptions">
            <Button variant="outline" size="lg" leftIcon={<Camera className="w-5 h-5" />}>
              Scan My Prescription
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SymptomAnalysis;
