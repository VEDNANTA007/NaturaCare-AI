import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, Skull, Thermometer, Frown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Nausea",
  "Fatigue",
  "Sore Throat",
  "Body Aches",
  "Dizziness",
  "Stomach Pain",
  "Chest Tightness",
];

const symptomInfoCards = [
  {
    icon: Skull,
    title: "Headache",
    description: "Feeling pressure or a throbbing sensation?",
  },
  {
    icon: Thermometer,
    title: "Fever",
    description: "Feeling unusually warm, with chills or sweats?",
  },
  {
    icon: Frown,
    title: "Nausea",
    description: "Experiencing stomach discomfort or queasiness?",
  },
];

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

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAnalyze = async () => {
    if (!symptoms && selectedSymptoms.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms: symptoms,
          selectedSymptoms: selectedSymptoms,
        },
      });

      if (error) {
        throw error;
      }

      // Navigate to results with AI analysis data
      navigate("/symptom-analysis", {
        state: {
          symptoms: symptoms,
          selectedSymptoms: selectedSymptoms,
          analysis: data,
        },
      });
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: "Voice Input",
      description: "Voice recording feature coming soon!",
    });
  };

  const hasInput = symptoms.trim() || selectedSymptoms.length > 0;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-8">
                How are you feeling today?
              </h1>

              {/* Textarea */}
              <div className="relative mb-4">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Tell us what you're experiencing... (e.g., 'I have a sharp headache behind my eyes and a slight fever')"
                  className="w-full min-h-[180px] p-4 pr-14 rounded-2xl border border-border bg-card resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isRecording
                      ? "bg-destructive text-primary-foreground animate-pulse-recording"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                  aria-label="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Try to be specific. Mention when it started and what makes it better or worse.
              </p>

              {/* Common Symptoms */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-3">Or select common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={selectedSymptoms.includes(symptom) ? "chip-selected" : "chip"}
                      size="sm"
                      onClick={() => toggleSymptom(symptom)}
                      className="rounded-full"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!hasInput}
                isLoading={isAnalyzing}
                rightIcon={!isAnalyzing ? <Send className="w-4 h-4" /> : undefined}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? "AI Analyzing..." : "Analyze My Symptoms"}
              </Button>
            </motion.div>

            {/* Symptom Info Cards - Desktop Only */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex flex-col gap-4"
            >
              {symptomInfoCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-2xl p-6 shadow-card text-center"
                >
                  <div className="icon-circle icon-circle-teal w-16 h-16 mx-auto mb-4">
                    <card.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SymptomChecker;
