-- Add cast_members column to media table (cast is a reserved keyword)
ALTER TABLE public.media ADD COLUMN cast_members JSONB DEFAULT '[]'::jsonb;