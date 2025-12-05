import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Sparkles, Loader2, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useRemedies, getRemediesByCategory, DatabaseRemedy } from "@/hooks/useRemedies";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import RemedyDetailDialog from "@/components/remedies/RemedyDetailDialog";

import gingerTurmericTea from "@/assets/remedies/ginger-turmeric-tea.jpg";
import echinaceaTincture from "@/assets/remedies/echinacea-tincture.jpg";
import peppermintOil from "@/assets/remedies/peppermint-oil.jpg";
import chamomileTea from "@/assets/remedies/chamomile-tea.jpg";
import honeyLemonWater from "@/assets/remedies/honey-lemon-water.jpg";
import tulsiSteam from "@/assets/remedies/tulsi-steam.jpg";
import triphalaPowder from "@/assets/remedies/triphala-powder.jpg";
import ashwagandhaMilk from "@/assets/remedies/ashwagandha-milk.jpg";

const fallbackImages: Record<string, string> = {
  "ginger-turmeric-tea": gingerTurmericTea,
  "echinacea-tincture": echinaceaTincture,
  "peppermint-oil": peppermintOil,
  "chamomile-tea": chamomileTea,
  "honey-lemon-water": honeyLemonWater,
  "tulsi-steam": tulsiSteam,
  "triphala-powder": triphalaPowder,
  "ashwagandha-milk": ashwagandhaMilk,
};

const categories = ["All", "Immunity", "Digestion", "Respiratory", "Sleep Aid", "Pain Relief", "Stress Relief"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const RemediesLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRemedy, setSelectedRemedy] = useState<DatabaseRemedy | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const { remedies, isLoading, seedRemedies, generateRemedyImage, refetch } = useRemedies();
  const { user } = useAuth();

  const filteredRemedies = getRemediesByCategory(remedies, selectedCategory).filter(
    (remedy) =>
      remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getRemedyImage = (remedy: DatabaseRemedy): string => {
    if (remedy.image_url && remedy.image_url.startsWith('http')) {
      return remedy.image_url;
    }
    return fallbackImages[remedy.id] || gingerTurmericTea;
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedRemedies();
      toast({
        title: "Data Seeded",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed remedies data",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGenerateImage = async (remedy: DatabaseRemedy) => {
    setIsGeneratingImage(remedy.id);
    try {
      await generateRemedyImage(remedy);
      toast({
        title: "Image Generated",
        description: `New AI image created for ${remedy.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-caution text-caution"
                : star - 0.5 <= rating
                ? "fill-caution/50 text-caution"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Natural Remedies Library
            </h1>
            
            {user && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeedData}
                  disabled={isSeeding}
                >
                  {isSeeding ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync Data
                </Button>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground mb-8">
            Explore trusted remedies rooted in nature and backed by science.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-3xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search remedies by condition or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "chip-selected" : "chip"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading remedies...</span>
            </div>
          )}

          {/* Remedies Grid */}
          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredRemedies.map((remedy) => (
                <motion.div
                  key={remedy.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-card rounded-2xl overflow-hidden shadow-card group"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={getRemedyImage(remedy)}
                      alt={remedy.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* AI Image Badge */}
                    {remedy.image_url && remedy.image_url.startsWith('http') && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </div>
                    )}
                    
                    {/* Regenerate Image Button (for logged in users) */}
                    {user && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateImage(remedy);
                        }}
                        disabled={isGeneratingImage === remedy.id}
                        className="absolute bottom-2 right-2 bg-background/90 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Generate AI Image"
                      >
                        {isGeneratingImage === remedy.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {remedy.category}
                    </span>
                    <h3 className="font-semibold mt-2 mb-1">{remedy.name}</h3>
                    {remedy.traditional_name && (
                      <p className="text-xs text-muted-foreground mb-1 italic">
                        {remedy.traditional_name}
                      </p>
                    )}
                    {renderStars(remedy.rating)}
                    <Button 
                      className="w-full mt-4" 
                      size="sm"
                      onClick={() => setSelectedRemedy(remedy)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Recipe
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && filteredRemedies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No remedies found matching your search.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Remedy Detail Dialog */}
      <RemedyDetailDialog
        remedy={selectedRemedy}
        open={!!selectedRemedy}
        onOpenChange={(open) => !open && setSelectedRemedy(null)}
        getRemedyImage={getRemedyImage}
      />
    </Layout>
  );
};

export default RemediesLibrary;
