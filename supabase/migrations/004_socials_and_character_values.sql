-- Ensure character values and newer social profile fields exist on existing projects.
CREATE TABLE IF NOT EXISTS public.character_values (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Star',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.character_values ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'character_values'
      AND policyname = 'Public character_values are viewable by everyone.'
  ) THEN
    CREATE POLICY "Public character_values are viewable by everyone."
    ON public.character_values FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'character_values'
      AND policyname = 'Allow full access for service_role on character_values'
  ) THEN
    CREATE POLICY "Allow full access for service_role on character_values"
    ON public.character_values
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;

INSERT INTO public.character_values (title, description, icon_name, order_index)
SELECT * FROM (VALUES
  ('Komunikatif', 'Mampu menyampaikan pesan dengan jelas dan tepat sasaran', 'MessageCircle', 1),
  ('Kreatif', 'Selalu menghadirkan ide-ide segar dalam setiap karya', 'Sparkles', 2),
  ('Profesional', 'Berkomitmen penuh pada kualitas dan ketepatan waktu', 'Briefcase', 3),
  ('Terbuka untuk Proyek', 'Siap berkolaborasi dan menerima tantangan baru', 'Handshake', 4)
) AS seed(title, description, icon_name, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.character_values);

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS tiktok text;