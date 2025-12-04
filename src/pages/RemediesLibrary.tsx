import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { remedies, getRemediesByCategory } from "@/data/remedies";

import gingerTea from "@/assets/remedies/ginger-tea.jpg";
import echinacea from "@/assets/remedies/echinacea.jpg";
import peppermint from "@/assets/remedies/peppermint.jpg";
import chamomile from "@/assets/remedies/chamomile.jpg";

const imageMap: Record<string, string> = {
  "/remedies/ginger-tea.jpg": gingerTea,
  "/remedies/echinacea.jpg": echinacea,
  "/remedies/peppermint.jpg": peppermint,
  "/remedies/chamomile.jpg": chamomile,
};

const categories = ["All", "Immunity", "Digestion", "Skin Care", "Sleep", "Pain Relief"];

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

  const filteredRemedies = getRemediesByCategory(selectedCategory).filter(
    (remedy) =>
      remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Natural Remedies Library
          </h1>
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

          {/* Remedies Grid */}
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
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={imageMap[remedy.imageUrl] || gingerTea}
                    alt={remedy.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {remedy.category}
                  </span>
                  <h3 className="font-semibold mt-2 mb-1">{remedy.name}</h3>
                  {renderStars(remedy.rating)}
                  <Button className="w-full mt-4" size="sm">
                    View Recipe
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredRemedies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No remedies found matching your search.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default RemediesLibrary;
