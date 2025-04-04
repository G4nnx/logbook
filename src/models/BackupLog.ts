// This file is kept for backward compatibility
// The actual data structure is now defined in src/api/backupLogs.ts

export interface IBackupLog {
  id?: string;
  tanggal: Date;
  shift: "pagi" | "siang" | "sore";
  pic: string;
  timestamp: string;
  created_at?: string;
  updated_at?: string;
}

// Export a dummy model for backward compatibility
const BackupLog = {
  // Placeholder methods if needed for backward compatibility
  find: async () => [],
  findById: async () => null,
  create: async () => ({}),
  findByIdAndUpdate: async () => ({}),
  findByIdAndDelete: async () => ({}),
};

export default BackupLog;
