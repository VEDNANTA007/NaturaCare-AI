import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Camera, Leaf, Pill, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const featureCards = [
  {
    icon: Brain,
    title: "Smart Symptom Analysis",
    description: "Our AI analyzes your symptoms to provide intelligent insights and potential next steps.",
  },
  {
    icon: Pill,
    title: "Medicine Intelligence",
    description: "Scan and understand your prescriptions, including interactions and side effects.",
  },
  {
    icon: Leaf,
    title: "Natural Remedies",
    description: "Receive personalized, evidence-based natural remedy recommendations tailored to you.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={heroBg}
                alt="Nature background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/70 to-forest-dark/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
              >
                Your Intelligent Health Companion
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto"
              >
                Bridging modern AI-powered insights with holistic, natural wellness approaches.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild variant="hero" size="lg" leftIcon={<Activity className="w-5 h-5" />}>
                  <Link to="/symptom-checker">Describe Your Symptoms</Link>
                </Button>
                <Button asChild variant="hero-secondary" size="lg" leftIcon={<Camera className="w-5 h-5" />}>
                  <Link to="/prescriptions">Scan Your Prescription</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-4xl font-bold text-center mb-12"
          >
            Discover a Smarter Path to Wellness
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="feature-card"
              >
                <div className="icon-circle icon-circle-teal mb-4">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
