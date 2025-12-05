-- Create storage bucket for remedy images
INSERT INTO storage.buckets (id, name, public)
VALUES ('remedy-images', 'remedy-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to remedy images
CREATE POLICY "Public read access for remedy images"
ON storage.objects FOR SELECT
USING (bucket_id = 'remedy-images');

-- Allow authenticated users to upload remedy images
CREATE POLICY "Authenticated users can upload remedy images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'remedy-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update remedy images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'remedy-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete remedy images
CREATE POLICY "Authenticated users can delete remedy images"
ON storage.objects FOR DELETE
USING (bucket_id = 'remedy-images' AND auth.role() = 'authenticated');

-- Create natural_remedies table to store remedy data with generated images
CREATE TABLE IF NOT EXISTS public.natural_remedies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  traditional_name TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  condition_treated TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  preparation_steps TEXT[] DEFAULT '{}',
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  why_it_helps TEXT,
  how_it_works TEXT,
  evidence_level TEXT DEFAULT 'Traditional Use',
  safety_warnings TEXT[] DEFAULT '{}',
  contraindications TEXT[] DEFAULT '{}',
  pregnancy_safe BOOLEAN DEFAULT false,
  region TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 4.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS but allow public read
ALTER TABLE public.natural_remedies ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read remedies
CREATE POLICY "Anyone can view remedies"
ON public.natural_remedies FOR SELECT
USING (true);

-- Allow authenticated users to update remedies (for image regeneration)
CREATE POLICY "Authenticated users can update remedies"
ON public.natural_remedies FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_natural_remedies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_natural_remedies_timestamp
BEFORE UPDATE ON public.natural_remedies
FOR EACH ROW
EXECUTE FUNCTION public.update_natural_remedies_updated_at();