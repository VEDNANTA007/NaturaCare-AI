import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Camera, Info, ArrowRight, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFilePreview(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFilePreview(file);
  };

  const handleFilePreview = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image (JPG, PNG, WebP) or PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsUploading(true);

    try {
      const { data, error } = await supabase.functions.invoke('scan-prescription', {
        body: {
          imageBase64: preview,
        },
      });

      if (error) {
        throw error;
      }

      // Navigate to prescription breakdown with analysis data
      navigate("/prescription-breakdown", {
        state: {
          analysis: data,
          imagePreview: preview,
        },
      });
    } catch (error) {
      console.error('Error scanning prescription:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to analyze the prescription. Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChooseFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleTakePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Privacy Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Disclaimer</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your privacy is important. All uploads are processed securely and this service does not replace a professional medical consultation.
              </p>
              <button className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Upload Your Prescription
          </h1>
          <p className="text-muted-foreground mb-8">
            Securely upload an image of your prescription or medicine strip for AI-powered analysis.
          </p>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            } ${!preview ? 'cursor-pointer' : ''}`}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-lg font-medium">AI Analyzing your prescription...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </motion.div>
            ) : preview ? (
              <div className="py-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="max-h-64 mx-auto rounded-lg mb-4"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearPreview();
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedFile?.name}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleAnalyze} size="lg">
                    Analyze Prescription
                  </Button>
                  <Button variant="outline" onClick={handleChooseFile}>
                    Choose Different File
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Upload your prescription or medicine strip
                </h3>
                <p className="text-muted-foreground mb-6">
                  Drag & drop your file here, or click to choose a file
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleChooseFile}>
                    <Image className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTakePhoto}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  Accepted file types: JPG, PNG, WebP, PDF. Max file size: 10MB.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PrescriptionUpload;
