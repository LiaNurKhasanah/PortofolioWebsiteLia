-- Create character_values table
CREATE TABLE IF NOT EXISTS character_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Star',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE character_values ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access on character_values"
  ON character_values
  FOR SELECT
  TO public
  USING (true);

-- Allow full access to authenticated users (admin)
CREATE POLICY "Allow full access for authenticated users on character_values"
  ON character_values
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default data
INSERT INTO character_values (title, description, icon_name, order_index) VALUES
  ('Komunikatif', 'Mampu menyampaikan pesan dengan jelas dan tepat sasaran', 'MessageCircle', 1),
  ('Kreatif', 'Selalu menghadirkan ide-ide segar dalam setiap karya', 'Sparkles', 2),
  ('Profesional', 'Berkomitmen penuh pada kualitas dan ketepatan waktu', 'Briefcase', 3),
  ('Terbuka untuk Proyek', 'Siap berkolaborasi dan menerima tantangan baru', 'Handshake', 4);