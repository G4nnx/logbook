import { supabase } from "../lib/supabaseClient";

export interface BackupLogData {
  id?: string;
  tanggal: Date;
  shift: "pagi" | "siang" | "sore";
  pic: string;
  timestamp: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveBackupLog(
  logData: Omit<BackupLogData, "id" | "created_at" | "updated_at">,
) {
  try {
    // Format the date as YYYY-MM-DD without timezone adjustments
    const year = logData.tanggal.getFullYear();
    const month = String(logData.tanggal.getMonth() + 1).padStart(2, "0"); // +1 because months are 0-indexed
    const day = String(logData.tanggal.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const { data, error } = await supabase
      .from("backup_logs")
      .insert({
        tanggal: formattedDate,
        shift: logData.shift,
        pic: logData.pic,
        timestamp: logData.timestamp,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving backup log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getBackupLogs() {
  try {
    const { data, error } = await supabase
      .from("backup_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching backup logs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
