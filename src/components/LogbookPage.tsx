import React, { useState, useEffect } from "react";
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import LogbookTable from "./LogbookTable";
import EntryForm from "./EntryForm";
import EntryDetails from "./EntryDetails";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  getLogbookEntries,
  saveLogbookEntry,
  updateLogbookEntry,
  deleteLogbookEntry,
  LogbookEntryData,
} from "../api/logbookEntries";
import { useToast } from "./ui/use-toast";
import * as XLSX from "xlsx";

export interface LogbookEntry {
  id?: string;
  tanggal_mulai: Date;
  jenis_pekerjaan: string;
  department: string;
  tanggal_selesai?: Date;
  pic: string;
  status: "pending" | "in progress" | "completed";
  keterangan?: string;
  nomor_pr?: string;
  created_at?: string;
  updated_at?: string;
}

const LogbookPage = () => {
  const [entries, setEntries] = useState<LogbookEntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntryData | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, [filters]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await getLogbookEntries(filters);
      if (response.success) {
        // Convert string dates to Date objects for UI
        const formattedEntries = response.data.map((entry) => ({
          ...entry,
          tanggal_mulai: new Date(entry.tanggal_mulai),
          tanggal_selesai: entry.tanggal_selesai
            ? new Date(entry.tanggal_selesai)
            : undefined,
        }));
        setEntries(formattedEntries);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch entries",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleAddEntry = async (
    data: Omit<LogbookEntry, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      // Convert to the format expected by the API
      const entryData = {
        ...data,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_selesai: data.tanggal_selesai || null,
      };

      const response = await saveLogbookEntry(entryData);
      if (response.success) {
        // Format the returned data for UI
        const formattedEntry = {
          ...response.data,
          tanggal_mulai: new Date(response.data.tanggal_mulai),
          tanggal_selesai: response.data.tanggal_selesai
            ? new Date(response.data.tanggal_selesai)
            : undefined,
        };

        setEntries((prev) => [formattedEntry, ...prev]);
        setIsFormOpen(false);
        toast({
          title: "Success",
          description: "Entry added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEntry = async (data: LogbookEntry) => {
    if (!selectedEntry?.id) return;

    try {
      const response = await updateLogbookEntry(selectedEntry.id, data);
      if (response.success) {
        // Format the returned data for UI
        const formattedEntry = {
          ...response.data,
          tanggal_mulai: new Date(response.data.tanggal_mulai),
          tanggal_selesai: response.data.tanggal_selesai
            ? new Date(response.data.tanggal_selesai)
            : undefined,
        };

        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === selectedEntry.id ? formattedEntry : entry,
          ),
        );
        setIsEditing(false);
        setIsDetailsOpen(false);
        toast({
          title: "Success",
          description: "Entry updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await deleteLogbookEntry(id);
      if (response.success) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        setIsDetailsOpen(false);
        toast({
          title: "Success",
          description: "Entry deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (entry: LogbookEntryData) => {
    setSelectedEntry(entry);
    setIsDetailsOpen(true);
  };

  const handleEditEntry = () => {
    setIsEditing(true);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  const exportToExcel = () => {
    // Format the data for Excel
    const formattedData = entries.map((entry) => ({
      "No. PR": entry.nomor_pr || "-",
      "Tanggal Mulai":
        entry.tanggal_mulai instanceof Date
          ? entry.tanggal_mulai.toLocaleDateString()
          : new Date(entry.tanggal_mulai).toLocaleDateString(),
      "Jenis Pekerjaan": entry.jenis_pekerjaan,
      Department: entry.department,
      "Tanggal Selesai": entry.tanggal_selesai
        ? entry.tanggal_selesai instanceof Date
          ? entry.tanggal_selesai.toLocaleDateString()
          : new Date(entry.tanggal_selesai).toLocaleDateString()
        : "-",
      PIC: entry.pic,
      Status: entry.status,
      Keterangan: entry.keterangan || "-",
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IT Logbook");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "it_logbook.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">IT Logbook</h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                setSelectedEntry(null);
                setIsEditing(false);
                setIsFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Entry
            </Button>
            <Button
              onClick={exportToExcel}
              disabled={entries.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Export to Excel
            </Button>
          </div>
        </div>

        <FilterPanel onFilterChange={handleFilterChange} />

        <div className="mt-6">
          <LogbookTable
            entries={entries}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <EntryForm
            onSubmit={isEditing ? handleUpdateEntry : handleAddEntry}
            initialData={isEditing ? selectedEntry || undefined : undefined}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedEntry && (
            <EntryDetails
              entry={selectedEntry}
              onEdit={handleEditEntry}
              onDelete={() =>
                selectedEntry.id && handleDeleteEntry(selectedEntry.id)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogbookPage;
