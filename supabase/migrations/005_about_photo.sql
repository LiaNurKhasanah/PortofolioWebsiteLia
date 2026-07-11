-- Add about_photo_url to profile table
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS about_photo_url text;
