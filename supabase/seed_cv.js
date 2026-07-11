import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local
const envPath = path.resolve('frontend/.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    // Remove enclosing quotes if any
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or Service Role Key not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

async function seed() {
  console.log('Starting seed database based on KONSEPAN CV.pdf...');

  // 1. Update Profile (id=1)
  const profileData = {
    name: 'Lia Nur Khasanah',
    tagline: 'Mahasiswi Ilmu Komunikasi | Content Writer | Social Media Specialist | Voice Over Enthusiast',
    headline: 'Saya membantu menyampaikan pesan melalui tulisan, konten digital, public speaking, dan suara yang komunikatif, hangat, serta profesional.',
    bio: 'Saya adalah mahasiswi Ilmu Komunikasi yang aktif, adaptif, dan berorientasi pada pertumbuhan. Saya memiliki ketertarikan pada komunikasi digital, content writing, personal branding, public speaking, dan voice over. Saya juga aktif dalam organisasi, kepanitiaan, magang, serta pengelolaan media sosial. Bagi saya, komunikasi bukan hanya menyampaikan pesan, tetapi juga membangun hubungan dan memberi dampak.',
    email: 'lianurkhasanah200506@gmail.com',
    whatsapp: '083154965387',
    linkedin: 'linkedin.com/in/lia-nur-khasanah',
    instagram: '@lianrkhsnhh',
    location: 'Yogyakarta, Indonesia'
  };

  const { error: profileError } = await supabase
    .from('profile')
    .upsert({ id: 1, ...profileData });

  if (profileError) {
    console.error('Error upserting profile:', profileError);
  } else {
    console.log('Profile upserted successfully.');
  }

  // 2. Seed Skills
  console.log('Seeding skills...');
  const { error: deleteSkillsError } = await supabase.from('skills').delete().neq('id', 0);
  if (deleteSkillsError) console.error('Error clearing skills:', deleteSkillsError);

  const skillsData = [
    { name: 'Content Writing', category: 'Hard Skill', icon: 'FileText', sort_order: 1 },
    { name: 'Copywriting', category: 'Hard Skill', icon: 'PenTool', sort_order: 2 },
    { name: 'Social Media Management', category: 'Hard Skill', icon: 'Share2', sort_order: 3 },
    { name: 'Voice Over', category: 'Hard Skill', icon: 'Mic', sort_order: 4 },
    { name: 'Public Speaking', category: 'Soft Skill', icon: 'Users', sort_order: 5 },
    { name: 'Content Planning', category: 'Hard Skill', icon: 'Calendar', sort_order: 6 },
    { name: 'Leadership', category: 'Soft Skill', icon: 'Award', sort_order: 7 },
    { name: 'Event Management', category: 'Soft Skill', icon: 'Briefcase', sort_order: 8 }
  ];

  const { error: skillsError } = await supabase.from('skills').insert(skillsData);
  if (skillsError) {
    console.error('Error inserting skills:', skillsError);
  } else {
    console.log('Skills seeded successfully.');
  }

  // 3. Seed Experiences
  console.log('Seeding experiences...');
  const { error: deleteExpError } = await supabase.from('experiences').delete().neq('id', 0);
  if (deleteExpError) console.error('Error clearing experiences:', deleteExpError);

  const experiencesData = [
    {
      title: 'Wakil Ketua Umum',
      organization: 'UKMF Riset',
      role_type: 'organization',
      period_start: '2026',
      period_end: 'Sekarang',
      description: 'Mendampingi ketua umum, mengoordinasikan divisi, dan membantu pengambilan keputusan organisasi.',
      is_current: true,
      sort_order: 1
    },
    {
      title: 'Blog Writer',
      organization: 'SKID',
      role_type: 'freelance',
      period_start: '2025',
      period_end: '2026',
      description: 'Menulis artikel dan merancang konten seputar salon, kecantikan, self-care, dan motivasi bisnis.',
      is_current: false,
      sort_order: 2
    },
    {
      title: 'Copywriter Intern',
      organization: 'ICA Course',
      role_type: 'internship',
      period_start: '2025',
      period_end: '2025',
      description: 'Membuat caption, naskah feed, dan materi promosi untuk program bimbingan belajar.',
      is_current: false,
      sort_order: 3
    },
    {
      title: 'Social Media Specialist',
      organization: 'Sentara Production',
      role_type: 'freelance',
      period_start: '2025',
      period_end: '2025',
      description: 'Mengelola Instagram, membuat content plan, copywriting, dan membantu meningkatkan awareness project film.',
      is_current: false,
      sort_order: 4
    },
    {
      title: 'Social Media Specialist',
      organization: 'Nimbara Production',
      role_type: 'freelance',
      period_start: '2024',
      period_end: '2025',
      description: 'Merancang konten, mengelola visual Instagram, dan menjaga identitas production house agar konsisten.',
      is_current: false,
      sort_order: 5
    }
  ];

  const { error: expError } = await supabase.from('experiences').insert(experiencesData);
  if (expError) {
    console.error('Error inserting experiences:', expError);
  } else {
    console.log('Experiences seeded successfully.');
  }

  // 4. Seed Projects
  console.log('Seeding projects...');
  const { error: deleteProjError } = await supabase.from('projects').delete().neq('id', 0);
  if (deleteProjError) console.error('Error clearing projects:', deleteProjError);

  const projectsData = [
    {
      title: 'Project SKID',
      category: 'Blog Writing',
      role: 'Blog Writer & Content Planner',
      period: '2025',
      description: 'Menulis artikel blog serta merancang konten bulanan seputar kecantikan, salon, self-care, dan strategi bisnis salon.',
      responsibilities: 'Menulis artikel SEO-friendly, merancang konten kalender, melakukan riset topik kecantikan.',
      tools: 'WordPress, Notion, Google Docs',
      results: 'Tampilkan screenshot kalender konten, artikel, dan contoh tulisan.',
      is_featured: true,
      sort_order: 1
    },
    {
      title: 'Project Sentara Production',
      category: 'Social Media',
      role: 'Social Media Specialist',
      period: '2025',
      description: 'Mengelola media sosial Instagram untuk Sentara Production guna mempromosikan film dan meningkatkan keterlibatan audiens.',
      responsibilities: 'Membuat content plan bulanan, merancang caption kreatif, berkoordinasi dengan tim kreatif film.',
      tools: 'Instagram, Canva, Meta Business Suite',
      results: 'Tampilkan screenshot Instagram, feed, caption, dan dokumentasi project.',
      is_featured: true,
      sort_order: 2
    },
    {
      title: 'Project Nimbara Production',
      category: 'Social Media',
      role: 'Social Media Specialist',
      period: '2024',
      description: 'Merancang konten media sosial dan mengelola identitas visual Instagram production house Nimbara agar tetap konsisten dan estetik.',
      responsibilities: 'Copywriting naskah feed, mengelola visual feed, riset tren perfilman lokal.',
      tools: 'Instagram, Canva, Figma',
      results: 'Tampilkan feed Instagram, konten kru, poster, dan caption.',
      is_featured: true,
      sort_order: 3
    },
    {
      title: 'Project ICA Course',
      category: 'Copywriting',
      role: 'Copywriter Konten',
      period: '2025',
      description: 'Mengembangkan materi promosi dan caption instagram bulanan untuk program bimbingan belajar di ICA Course.',
      responsibilities: 'Membuat copywriting kreatif untuk penawaran kelas bimbingan belajar, merancang kalender editorial.',
      tools: 'Notion, Google Docs, Instagram',
      results: 'Tampilkan kalender editorial, caption, dan materi promosi.',
      is_featured: true,
      sort_order: 4
    }
  ];

  const { error: projError } = await supabase.from('projects').insert(projectsData);
  if (projError) {
    console.error('Error inserting projects:', projError);
  } else {
    console.log('Projects seeded successfully.');
  }

  // 5. Seed Voice Overs
  console.log('Seeding voice overs...');
  const { error: deleteVOError } = await supabase.from('voice_overs').delete().neq('id', 0);
  if (deleteVOError) console.error('Error clearing voice_overs:', deleteVOError);

  const voData = [
    {
      title: 'Demo Commercial',
      category: 'Commercial Voice Over',
      description: 'Gaya suara hangat, enerjik, dan persuasif untuk promosi brand iklan komersial digital.',
      voice_style: 'Warm, Energetic, Persuasive',
      use_case: 'Iklan Media Sosial, Iklan Radio',
      duration_seconds: 30,
      is_featured: true,
      sort_order: 1
    },
    {
      title: 'Demo Company Profile',
      category: 'Company Profile',
      description: 'Gaya suara profesional, berwibawa, dan elegan untuk menjelaskan profil perusahaan.',
      voice_style: 'Professional, Corporate, Confident',
      use_case: 'Video Company Profile, Presentasi B2B',
      duration_seconds: 90,
      is_featured: true,
      sort_order: 2
    },
    {
      title: 'Demo Event Promotion',
      category: 'Event Promotion',
      description: 'Gaya suara komunikatif dan bersemangat untuk mempromosikan acara berskala besar.',
      voice_style: 'Exciting, Informative, Hype',
      use_case: 'Bumper Video Event, Promo Webinar',
      duration_seconds: 45,
      is_featured: true,
      sort_order: 3
    },
    {
      title: 'Demo Educational Content',
      category: 'Educational Content',
      description: 'Gaya suara jelas, artikulatif, dan mengayomi untuk media belajar interaktif atau e-learning.',
      voice_style: 'Clear, Friendly, Educational',
      use_case: 'Video E-learning, Podcast Edukasi',
      duration_seconds: 120,
      is_featured: true,
      sort_order: 4
    },
    {
      title: 'Demo Storytelling',
      category: 'Storytelling',
      description: 'Gaya suara ekspresif dan penuh penjiwaan untuk membacakan narasi cerita atau dongeng.',
      voice_style: 'Expressive, Narrative, Calm',
      use_case: 'Audiobook, Narasi Cerita Pendek',
      duration_seconds: 180,
      is_featured: true,
      sort_order: 5
    }
  ];

  const { error: voError } = await supabase.from('voice_overs').insert(voData);
  if (voError) {
    console.error('Error inserting voice overs:', voError);
  } else {
    console.log('Voice overs seeded successfully.');
  }

  // 6. Seed Achievements
  console.log('Seeding achievements...');
  const { error: deleteAchError } = await supabase.from('achievements').delete().neq('id', 0);
  if (deleteAchError) console.error('Error clearing achievements:', deleteAchError);

  const achievementsData = [
    { title: 'Google Student Ambassador 2026', type: 'ambassador', year: 2026, level: 'Internasional', organizer: 'Google', is_featured: true, sort_order: 1 },
    { title: 'Juara Harapan 2 Lomba Orasi Pendidikan Tingkat Nasional', type: 'competition', year: 2025, level: 'Nasional', organizer: 'Kementerian Pendidikan', is_featured: true, sort_order: 2 },
    { title: 'Juara Harapan 1 Lomba Cipta Puisi Festival Kata Kompas 2025', type: 'competition', year: 2025, level: 'Nasional', organizer: 'Harian Kompas', is_featured: true, sort_order: 3 },
    { title: 'Juara 2 Lomba Esai UKMF Riset UTM', type: 'competition', year: 2025, level: 'Universitas', organizer: 'UKMF Riset UTM', is_featured: true, sort_order: 4 },
    { title: 'Juara 3 Lomba Baca Puisi Bulan Sosiologi UTM', type: 'competition', year: 2024, level: 'Universitas', organizer: 'HIMA Sosiologi UTM', is_featured: true, sort_order: 5 },
    { title: 'Penulis Buku Kebumen Geopark', type: 'publication', year: 2024, level: 'Kabupaten', organizer: 'Pemkab Kebumen', is_featured: true, sort_order: 6 },
    { title: 'Juara 1 Lomba Poster Tingkat Kabupaten', type: 'competition', year: 2023, level: 'Kabupaten', organizer: 'Dinas Kebudayaan', is_featured: true, sort_order: 7 }
  ];

  const { error: achError } = await supabase.from('achievements').insert(achievementsData);
  if (achError) {
    console.error('Error inserting achievements:', achError);
  } else {
    console.log('Achievements seeded successfully.');
  }

  // 7. Seed Certificates
  console.log('Seeding certificates...');
  const { error: deleteCertError } = await supabase.from('certificates').delete().neq('id', 0);
  if (deleteCertError) console.error('Error clearing certificates:', deleteCertError);

  const certificatesData = [
    { title: 'Sertifikat Public Speaking & Master of Ceremony', issuer: 'Lembaga Pendidikan Vokasi UMP', issued_date: 'Oktober 2025', credential_url: 'https://credentials.example.com/mc-speaking', category: 'Public Speaking', is_featured: true, sort_order: 1 },
    { title: 'Sertifikasi Professional Copywriter & Content Writer', issuer: 'Indonesia Communications Academy', issued_date: 'Agustus 2025', credential_url: 'https://credentials.example.com/copywriting', category: 'Writing', is_featured: true, sort_order: 2 },
    { title: 'Sertifikat Kompetensi Pengelolaan Media Sosial Kreatif', issuer: 'Sentara Institute & Creative Film', issued_date: 'Maret 2024', credential_url: 'https://credentials.example.com/socialmedia', category: 'Social Media', is_featured: true, sort_order: 3 }
  ];

  const { error: certError } = await supabase.from('certificates').insert(certificatesData);
  if (certError) {
    console.error('Error inserting certificates:', certError);
  } else {
    console.log('Certificates seeded successfully.');
  }

  console.log('All database tables seeded successfully!');
}

seed().catch(err => {
  console.error('Fatal error during seed execution:', err);
  process.exit(1);
});
