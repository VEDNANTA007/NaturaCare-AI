import { useState } from "react";
import { AlertTriangle, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DisclaimerBar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -48 }}
        animate={{ y: 0 }}
        className="disclaimer-bar sticky top-0 z-50"
      >
        {isMinimized ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsMinimized(false)}
            className="w-full h-8 flex items-center justify-center gap-2 text-sm font-medium hover:bg-disclaimer-border/20 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Disclaimer</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-12 flex items-center justify-center px-4"
          >
            <div className="flex items-center gap-2 text-sm max-w-6xl mx-auto">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="font-medium text-center">
                NaturaCare AI is for informational purposes only and is not a substitute for professional medical advice. Always consult a healthcare provider for any medical concerns.
              </p>
              <button
                onClick={() => setIsMinimized(true)}
                className="ml-2 p-1 hover:bg-disclaimer-border/30 rounded transition-colors shrink-0"
                aria-label="Minimize disclaimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DisclaimerBar;
