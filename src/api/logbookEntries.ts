import { supabase } from "../lib/supabaseClient";

export interface LogbookEntryData {
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

export async function saveLogbookEntry(
  entryData: Omit<LogbookEntryData, "id" | "created_at" | "updated_at">,
) {
  try {
    const formattedData = {
      ...entryData,
      tanggal_mulai: entryData.tanggal_mulai.toISOString().split("T")[0],
      tanggal_selesai: entryData.tanggal_selesai
        ? entryData.tanggal_selesai.toISOString().split("T")[0]
        : null,
    };

    const { data, error } = await supabase
      .from("logbook_entries")
      .insert(formattedData)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving logbook entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getLogbookEntries(filters = {}) {
  try {
    let query = supabase.from("logbook_entries").select("*");

    // Apply filters if any
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching logbook entries:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateLogbookEntry(
  id: string,
  updateData: Partial<LogbookEntryData>,
) {
  try {
    // Format dates if present
    const formattedData = { ...updateData };
    if (formattedData.tanggal_mulai instanceof Date) {
      formattedData.tanggal_mulai = formattedData.tanggal_mulai
        .toISOString()
        .split("T")[0];
    }
    if (formattedData.tanggal_selesai instanceof Date) {
      formattedData.tanggal_selesai = formattedData.tanggal_selesai
        .toISOString()
        .split("T")[0];
    }

    const { data, error } = await supabase
      .from("logbook_entries")
      .update(formattedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, error: "Entry not found" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error updating logbook entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteLogbookEntry(id: string) {
  try {
    const { error } = await supabase
      .from("logbook_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting logbook entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
