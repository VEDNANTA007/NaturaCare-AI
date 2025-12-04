import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Camera, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate upload and OCR processing
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsUploading(false);
    
    // Navigate to prescription breakdown
    navigate("/prescription-breakdown");
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
                Your privacy is important. All uploads are HIPAA compliant and this service does not replace a professional medical consultation.
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
            Securely upload an image of your prescription or medicine strip for analysis.
          </p>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Analyzing your prescription...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </motion.div>
            ) : preview ? (
              <div className="py-4">
                <img
                  src={preview}
                  alt="Prescription preview"
                  className="max-h-64 mx-auto rounded-lg mb-4"
                />
                <p className="text-sm text-muted-foreground">Click to upload a different file</p>
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
                  <Button onClick={(e) => e.stopPropagation()}>
                    Choose File
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<Camera className="w-4 h-4" />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Take Photo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  Accepted file types: JPG, PNG, PDF. Max file size: 10MB.
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
