-- 1. Profile Table
CREATE TABLE public.profile (
  id serial PRIMARY KEY,
  name text NOT NULL,
  tagline text NOT NULL,
  headline text NOT NULL,
  bio text NOT NULL,
  photo_url text,
  cv_url text,
  email text NOT NULL,
  whatsapp text NOT NULL,
  instagram text,
  linkedin text,
  youtube text,
  location text
);

-- 2. Skills Table
CREATE TABLE public.skills (
  id serial PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- 3. Experiences Table
CREATE TABLE public.experiences (
  id serial PRIMARY KEY,
  title text NOT NULL,
  organization text NOT NULL,
  role_type text NOT NULL,
  period_start text,
  period_end text,
  description text,
  is_current boolean DEFAULT false,
  sort_order integer DEFAULT 0
);

-- 4. Projects Table
CREATE TABLE public.projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  role text NOT NULL,
  period text,
  description text NOT NULL,
  responsibilities text,
  tools text,
  results text,
  project_url text,
  is_featured boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 5. Voice Overs Table
CREATE TABLE public.voice_overs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  description text,
  voice_style text,
  use_case text,
  audio_url text,
  duration_seconds integer,
  is_featured boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 6. Achievements Table
CREATE TABLE public.achievements (
  id serial PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL,
  year integer,
  level text,
  organizer text,
  description text,
  is_featured boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 7. Certificates Table
CREATE TABLE public.certificates (
  id serial PRIMARY KEY,
  title text NOT NULL,
  issuer text,
  issued_date text,
  credential_url text,
  category text,
  is_featured boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 8. Contact Messages Table
CREATE TABLE public.contact_messages (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  service_type text,
  status text DEFAULT 'unread',
  created_at timestamp with time zone DEFAULT now()
);

-- Optional: Initial Profile Seed
INSERT INTO public.profile (id, name, tagline, headline, bio, email, whatsapp, location)
VALUES (
  1,
  'Lia Nur Khasanah',
  'Mahasiswi Ilmu Komunikasi | Content Writer | Voice Over Enthusiast',
  'Saya membantu menyampaikan pesan melalui tulisan, konten digital, public speaking, dan suara yang komunikatif, hangat, serta profesional.',
  'Saya mahasiswi semester akhir prodi Ilmu Komunikasi di UIN Sunan Kalijaga Yogyakarta...',
  'lianurkhasanah200506@gmail.com',
  '083154965387',
  'Indonesia'
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies (Row Level Security)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_overs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public READ access for everything except contact_messages
CREATE POLICY "Public profiles are viewable by everyone." ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone." ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public experiences are viewable by everyone." ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public voice_overs are viewable by everyone." ON public.voice_overs FOR SELECT USING (true);
CREATE POLICY "Public achievements are viewable by everyone." ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public certificates are viewable by everyone." ON public.certificates FOR SELECT USING (true);

-- Allow public INSERT for contact_messages
CREATE POLICY "Anyone can send contact messages." ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin has full access to all tables (requires authenticated role or service key)
-- Since we're using service_role in Next.js Server Actions for admin mutations,
-- we don't strictly need additional policies for mutations, but it's good practice.
CREATE POLICY "Allow full access for service_role" ON public.profile USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.skills USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.experiences USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.projects USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.voice_overs USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.achievements USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.certificates USING (auth.role() = 'service_role');
CREATE POLICY "Allow full access for service_role" ON public.contact_messages USING (auth.role() = 'service_role');