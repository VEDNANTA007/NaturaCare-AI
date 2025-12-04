import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SymptomChecker from "./pages/SymptomChecker";
import SymptomAnalysis from "./pages/SymptomAnalysis";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import PrescriptionBreakdown from "./pages/PrescriptionBreakdown";
import RemediesLibrary from "./pages/RemediesLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/symptom-analysis" element={<SymptomAnalysis />} />
          <Route path="/prescriptions" element={<PrescriptionUpload />} />
          <Route path="/prescription-breakdown" element={<PrescriptionBreakdown />} />
          <Route path="/remedies" element={<RemediesLibrary />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
