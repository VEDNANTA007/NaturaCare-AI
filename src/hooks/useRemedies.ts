import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { remedies as localRemedies, Remedy as LocalRemedy } from '@/data/remedies';

export interface DatabaseRemedy {
  id: string;
  name: string;
  traditional_name?: string;
  category: string;
  tags: string[];
  condition_treated: string[];
  ingredients: string[];
  preparation_steps: string[];
  dosage?: string;
  frequency?: string;
  duration?: string;
  why_it_helps?: string;
  how_it_works?: string;
  evidence_level?: string;
  safety_warnings: string[];
  contraindications: string[];
  pregnancy_safe: boolean;
  region?: string;
  image_url?: string;
  rating: number;
}

export function useRemedies() {
  const [remedies, setRemedies] = useState<DatabaseRemedy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemedies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('natural_remedies')
        .select('*')
        .order('name');

      if (dbError) {
        throw dbError;
      }

      if (data && data.length > 0) {
        setRemedies(data as DatabaseRemedy[]);
      } else {
        // Fall back to local data if database is empty
        const mapped: DatabaseRemedy[] = localRemedies.map(r => ({
          id: r.id,
          name: r.name,
          traditional_name: r.traditionalName,
          category: r.category,
          tags: r.tags,
          condition_treated: r.conditionTreated,
          ingredients: r.ingredients,
          preparation_steps: r.preparationSteps,
          dosage: r.dosage,
          frequency: r.frequency,
          duration: r.duration,
          why_it_helps: r.whyItHelps,
          how_it_works: r.howItWorks,
          evidence_level: r.evidenceLevel,
          safety_warnings: r.safetyWarnings,
          contraindications: r.contraindications,
          pregnancy_safe: r.pregnancySafe,
          region: r.region,
          image_url: r.imageUrl,
          rating: r.rating,
        }));
        setRemedies(mapped);
      }
    } catch (err) {
      console.error('Error fetching remedies:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch remedies');
      
      // Fall back to local data on error
      const mapped: DatabaseRemedy[] = localRemedies.map(r => ({
        id: r.id,
        name: r.name,
        traditional_name: r.traditionalName,
        category: r.category,
        tags: r.tags,
        condition_treated: r.conditionTreated,
        ingredients: r.ingredients,
        preparation_steps: r.preparationSteps,
        dosage: r.dosage,
        frequency: r.frequency,
        duration: r.duration,
        why_it_helps: r.whyItHelps,
        how_it_works: r.howItWorks,
        evidence_level: r.evidenceLevel,
        safety_warnings: r.safetyWarnings,
        contraindications: r.contraindications,
        pregnancy_safe: r.pregnancySafe,
        region: r.region,
        image_url: r.imageUrl,
        rating: r.rating,
      }));
      setRemedies(mapped);
    } finally {
      setIsLoading(false);
    }
  };

  const seedRemedies = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('seed-remedies');
      
      if (error) throw error;
      
      await fetchRemedies();
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error seeding remedies:', err);
      throw err;
    }
  };

  const generateRemedyImage = async (remedy: DatabaseRemedy) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-remedy-image', {
        body: {
          remedy: {
            name: remedy.name,
            ingredients: remedy.ingredients,
            category: remedy.category,
          },
          remedyId: remedy.id,
        },
      });

      if (error) throw error;

      await fetchRemedies();
      return { success: true, imageUrl: data.imageUrl };
    } catch (err) {
      console.error('Error generating image:', err);
      throw err;
    }
  };

  const generateAllImages = async (onProgress?: (current: number, total: number, name: string) => void) => {
    const results: { name: string; success: boolean; error?: string }[] = [];
    
    for (let i = 0; i < remedies.length; i++) {
      const remedy = remedies[i];
      onProgress?.(i + 1, remedies.length, remedy.name);
      
      try {
        await generateRemedyImage(remedy);
        results.push({ name: remedy.name, success: true });
        
        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 12000));
      } catch (err) {
        results.push({ 
          name: remedy.name, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  };

  useEffect(() => {
    fetchRemedies();
  }, []);

  return {
    remedies,
    isLoading,
    error,
    refetch: fetchRemedies,
    seedRemedies,
    generateRemedyImage,
    generateAllImages,
  };
}

export function getRemediesByCategory(remedies: DatabaseRemedy[], category: string) {
  if (category === "All") return remedies;
  return remedies.filter(r => r.category === category || r.tags.includes(category));
}
