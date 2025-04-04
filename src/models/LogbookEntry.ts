// This file is kept for backward compatibility
// The actual data structure is now defined in src/api/logbookEntries.ts

export interface ILogbookEntry {
  id?: string;
  tanggal_mulai: Date;
  jenis_pekerjaan: string;
  department: string;
  tanggal_selesai?: Date | null;
  pic: string;
  status: "pending" | "in progress" | "completed";
  keterangan?: string | null;
  nomor_pr?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Export a dummy model for backward compatibility
const LogbookEntry = {
  // Placeholder methods if needed for backward compatibility
  find: async () => [],
  findById: async () => null,
  create: async () => ({}),
  findByIdAndUpdate: async () => ({}),
  findByIdAndDelete: async () => ({}),
};

export default LogbookEntry;
