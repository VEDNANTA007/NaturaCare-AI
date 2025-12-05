import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle2, XCircle, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { useRemedies } from "@/hooks/useRemedies";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: "info" | "success" | "error";
}

const AdminImageRegeneration = () => {
  const { user, loading: authLoading } = useAuth();
  const { remedies, isLoading, seedRemedies, generateAllImages, refetch } = useRemedies();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentRemedy, setCurrentRemedy] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    addLog("Starting to seed remedies data...", "info");
    
    try {
      const result = await seedRemedies();
      addLog(result.message, "success");
      toast({
        title: "Data Seeded",
        description: result.message,
      });
    } catch (error) {
      addLog(`Error seeding data: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateAllImages = async () => {
    if (remedies.length === 0) {
      toast({
        title: "No Remedies",
        description: "Please seed the data first before generating images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setLogs([]);
    addLog("Starting AI image generation for all remedies...", "info");
    addLog(`Total remedies to process: ${remedies.length}`, "info");
    addLog("⚠️ This will take approximately 2-3 minutes per remedy due to rate limits.", "info");

    try {
      const results = await generateAllImages((current, total, name) => {
        const pct = Math.round((current / total) * 100);
        setProgress(pct);
        setCurrentRemedy(name);
        addLog(`[${current}/${total}] Generating image for: ${name}`, "info");
      });

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      results.forEach(result => {
        if (result.success) {
          addLog(`✓ ${result.name}: Image generated successfully`, "success");
        } else {
          addLog(`✗ ${result.name}: ${result.error}`, "error");
        }
      });

      addLog(`\n=== Generation Complete ===`, "info");
      addLog(`Successful: ${successful}`, "success");
      if (failed > 0) {
        addLog(`Failed: ${failed}`, "error");
      }

      toast({
        title: "Image Generation Complete",
        description: `Generated ${successful} images successfully. ${failed > 0 ? `${failed} failed.` : ''}`,
      });

      await refetch();
    } catch (error) {
      addLog(`Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
      toast({
        title: "Error",
        description: "Image generation failed",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setCurrentRemedy("");
    }
  };

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Remedy Image Regeneration</h1>
          <p className="text-muted-foreground mb-8">
            Admin tool for managing AI-generated remedy images
          </p>

          {/* Warning Banner */}
          <div className="bg-caution/10 border border-caution/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-caution-foreground">
              ⚠️ <strong>Important:</strong> Regenerating all images will take approximately 10-15 minutes 
              due to API rate limits. Each image requires ~12 seconds delay between requests.
              Estimated cost: ~$0.30 for 8 remedies (OpenAI DALL-E pricing).
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-2xl font-bold">{remedies.length}</p>
              <p className="text-sm text-muted-foreground">Total Remedies</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-2xl font-bold">
                {remedies.filter(r => r.image_url?.startsWith('http')).length}
              </p>
              <p className="text-sm text-muted-foreground">AI Images</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-2xl font-bold">
                {remedies.filter(r => !r.image_url?.startsWith('http')).length}
              </p>
              <p className="text-sm text-muted-foreground">Fallback Images</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-2xl font-bold">~{remedies.length * 12}s</p>
              <p className="text-sm text-muted-foreground">Est. Time</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={handleSeedData}
              disabled={isSeeding || isGenerating}
              variant="outline"
              className="gap-2"
            >
              {isSeeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              Seed/Sync Remedies Data
            </Button>

            <Button
              onClick={handleGenerateAllImages}
              disabled={isGenerating || isSeeding || remedies.length === 0}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate All AI Images
            </Button>

            <Button
              onClick={refetch}
              disabled={isGenerating || isSeeding || isLoading}
              variant="ghost"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Generating: <span className="font-medium text-foreground">{currentRemedy}</span>
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Console Logs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
              <p className="text-sm font-medium">Console Output</p>
            </div>
            <div className="h-96 overflow-y-auto p-4 font-mono text-sm space-y-1">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">
                  No logs yet. Click a button to start.
                </p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${
                      log.type === "success"
                        ? "text-success"
                        : log.type === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-muted-foreground/50 flex-shrink-0">
                      [{log.timestamp.toLocaleTimeString()}]
                    </span>
                    {log.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    {log.type === "error" && <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span className="break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Remedy List */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Remedies Status</h2>
            <div className="space-y-2">
              {remedies.map((remedy) => (
                <div
                  key={remedy.id}
                  className="flex items-center justify-between bg-card rounded-lg p-3 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={remedy.image_url?.startsWith('http') ? remedy.image_url : '/placeholder.svg'}
                      alt={remedy.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{remedy.name}</p>
                      <p className="text-xs text-muted-foreground">{remedy.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {remedy.image_url?.startsWith('http') ? (
                      <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        Fallback
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminImageRegeneration;
