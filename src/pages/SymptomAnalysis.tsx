import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Droplet, Leaf, Pill, Calendar, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

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

const remedies = [
  {
    icon: Droplet,
    title: "Peppermint Oil",
    why: "Contains menthol, which can help relax muscles and ease pain.",
    how: "Apply diluted oil to your temples.",
  },
  {
    icon: Leaf,
    title: "Stay Hydrated",
    why: "Dehydration can trigger tension headaches or make them worse.",
    how: "Drink plenty of water throughout the day.",
  },
  {
    icon: Pill,
    title: "Magnesium",
    why: "May help prevent headaches by reducing muscle tension.",
    how: "Eat leafy greens, nuts, and seeds.",
  },
];

const redFlags = [
  "A sudden, severe headache unlike any you've had before.",
  "Headache accompanied by fever, stiff neck, or confusion.",
  "Headaches that worsen or persist for more than 48 hours.",
];

const SymptomAnalysis = () => {
  const location = useLocation();
  const { symptoms, selectedSymptoms } = location.state || {};

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Symptom Analysis Result
          </h1>
          <p className="text-muted-foreground">
            Based on the information you provided, here is a summary of potential conditions and natural remedies.
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-severity-moderate/20 text-severity-moderate font-semibold text-sm">
              <AlertCircle className="w-4 h-4" />
              MODERATE SEVERITY
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Potential Tension Headache
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-4">
            Our analysis suggests your symptoms are consistent with a tension-type headache, often caused by stress or muscle strain. This is a common condition and is typically manageable with self-care.
          </p>
          <p className="text-sm text-muted-foreground text-center italic">
            This AI-generated summary provides a potential explanation. It is not a medical diagnosis.
          </p>
        </motion.div>

        {/* Recommended Natural Remedies */}
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
            {remedies.map((remedy, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-xl p-5 shadow-card"
              >
                <div className="icon-circle icon-circle-teal mb-3">
                  <remedy.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold mb-2">{remedy.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Why it helps:</span> {remedy.why}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">How to use:</span> {remedy.how}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Two Column Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* When to See a Doctor */}
          <div className="bg-destructive/10 rounded-xl p-5 border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              When to See a Doctor
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              While tension headaches are common, seek professional medical advice if you experience any of the following:
            </p>
            <ul className="space-y-2">
              {redFlags.map((flag, index) => (
                <li key={index} className="text-sm text-destructive flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>

          {/* Optional Medicine Support */}
          <div className="bg-muted rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Optional Medicine Support</h3>
            <p className="text-sm text-muted-foreground">
              Over-the-counter pain relievers like ibuprofen or acetaminophen can provide temporary relief. Always follow the package directions and consult with a pharmacist or doctor if you have other health conditions or take other medications.
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
          <Button asChild variant="outline" size="lg" leftIcon={<Camera className="w-5 h-5" />}>
            <Link to="/prescriptions">Scan My Prescription</Link>
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SymptomAnalysis;
