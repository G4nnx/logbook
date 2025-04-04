-- Create backup_logs table
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanggal DATE NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('pagi', 'siang', 'sore')),
  pic TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logbook_entries table
CREATE TABLE IF NOT EXISTS logbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanggal_mulai DATE NOT NULL,
  jenis_pekerjaan TEXT NOT NULL,
  department TEXT NOT NULL,
  tanggal_selesai DATE,
  pic TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in progress', 'completed')),
  keterangan TEXT,
  nomor_pr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for both tables
alter publication supabase_realtime add table backup_logs;
alter publication supabase_realtime add table logbook_entries;