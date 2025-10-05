-- Create media table for storing movies, TV series, and mini series
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Movie', 'TV Series', 'Mini Series')),
  genres TEXT[] DEFAULT '{}',
  quality TEXT,
  media_number TEXT,
  seen BOOLEAN DEFAULT false,
  backed_up BOOLEAN DEFAULT false,
  poster_url TEXT,
  imdb_url TEXT,
  tmdb_url TEXT,
  edition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create episodes table for TV series and mini series
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  episode INTEGER NOT NULL,
  title TEXT,
  seen BOOLEAN DEFAULT false,
  backed_up BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(media_id, season, episode)
);

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media table
CREATE POLICY "Users can view their own media"
  ON public.media FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON public.media FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON public.media FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for episodes table
CREATE POLICY "Users can view episodes of their media"
  ON public.episodes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.media
      WHERE media.id = episodes.media_id
      AND media.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert episodes for their media"
  ON public.episodes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.media
      WHERE media.id = episodes.media_id
      AND media.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update episodes of their media"
  ON public.episodes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.media
      WHERE media.id = episodes.media_id
      AND media.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete episodes of their media"
  ON public.episodes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.media
      WHERE media.id = episodes.media_id
      AND media.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_media_user_id ON public.media(user_id);
CREATE INDEX idx_media_type ON public.media(type);
CREATE INDEX idx_episodes_media_id ON public.episodes(media_id);