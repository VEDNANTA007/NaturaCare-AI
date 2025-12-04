import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Droplet, Leaf, Pill, Calendar, Camera, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const getLevelSentimentColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "level 1":
      return "bg-green-500/20 text-green-600 border-green-500/30";
    case "level 2":
      return "bg-amber-500/20 text-amber-600 border-amber-500/30";
    case "level moderation":
      return "bg-red-500/20 text-red-600 border-red-500/30";
    default:
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
  }
};

const getLevelIcon = (level: string) => {
  switch (level?.toLowerCase()) {
    case "level 1":
      return Leaf;
    case "level 2":
      return Zap;
    case "level moderation":
      return AlertCircle;
    default:
      return Leaf;
  }
};

// Function to categorize remedies by sentiment level
const categorizeRemediesByLevel = (remedies: any[]) => {
  const level1: any[] = [];
  const level2: any[] = [];
  const levelModeration: any[] = [];

  remedies.forEach((remedy, index) => {
    if (index % 3 === 0) {
      level1.push(remedy);
    } else if (index % 3 === 1) {
      level2.push(remedy);
    } else {
      levelModeration.push(remedy);
    }
  });

  return { level1, level2, levelModeration };
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
  const { level1, level2, levelModeration } = categorizeRemediesByLevel(remedies);

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

        {/* Sentiment Levels with Remedies */}
        {remedies.length > 0 && (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Symptom Sentiment Levels & Remedies
            </h3>

            <Tabs defaultValue="level1" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="level1" className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Level 1
                </TabsTrigger>
                <TabsTrigger value="level2" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Level 2
                </TabsTrigger>
                <TabsTrigger value="levelModeration" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Level Moderation
                </TabsTrigger>
              </TabsList>

              {/* Level 1 - Mild Symptoms */}
              <TabsContent value="level1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-6 mb-6 border-2 ${getLevelSentimentColor("level 1")}`}
                >
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Level 1 - Mild Symptoms
                  </h4>
                  <p className="text-sm">Light and natural remedies to support mild symptom relief.</p>
                </motion.div>

                {level1.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {level1.map((remedy: any, index: number) => {
                      const Icon = getIconForRemedy(remedy.title);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="bg-card rounded-xl p-5 shadow-card border-l-4 border-l-green-500"
                        >
                          <div className="icon-circle icon-circle-green mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h5 className="font-semibold mb-2">{remedy.title}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Why it helps:</span> {remedy.why}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">How to use:</span> {remedy.how}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No remedies available for this level.</p>
                )}
              </TabsContent>

              {/* Level 2 - Moderate Symptoms */}
              <TabsContent value="level2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-6 mb-6 border-2 ${getLevelSentimentColor("level 2")}`}
                >
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Level 2 - Moderate Symptoms
                  </h4>
                  <p className="text-sm">Enhanced remedies for moderate symptom management.</p>
                </motion.div>

                {level2.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {level2.map((remedy: any, index: number) => {
                      const Icon = getIconForRemedy(remedy.title);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="bg-card rounded-xl p-5 shadow-card border-l-4 border-l-amber-500"
                        >
                          <div className="icon-circle icon-circle-amber mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h5 className="font-semibold mb-2">{remedy.title}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Why it helps:</span> {remedy.why}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">How to use:</span> {remedy.how}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No remedies available for this level.</p>
                )}
              </TabsContent>

              {/* Level Moderation - High Symptoms */}
              <TabsContent value="levelModeration">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-6 mb-6 border-2 ${getLevelSentimentColor("level moderation")}`}
                >
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Level Moderation - High Symptoms
                  </h4>
                  <p className="text-sm">Intensive natural remedies for significant symptom relief. Consider consulting a healthcare professional.</p>
                </motion.div>

                {levelModeration.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {levelModeration.map((remedy: any, index: number) => {
                      const Icon = getIconForRemedy(remedy.title);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="bg-card rounded-xl p-5 shadow-card border-l-4 border-l-red-500"
                        >
                          <div className="icon-circle icon-circle-red mb-3">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h5 className="font-semibold mb-2">{remedy.title}</h5>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Why it helps:</span> {remedy.why}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">How to use:</span> {remedy.how}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No remedies available for this level.</p>
                )}
              </TabsContent>
            </Tabs>
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
