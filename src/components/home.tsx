import React, { useState } from "react";
import Header from "./Header";
import FilterPanel from "./FilterPanel";
import LogbookTable from "./LogbookTable";
import EntryForm from "./EntryForm";
import EntryDetails from "./EntryDetails";
import { Button } from "./ui/button";
import { PlusCircle, Database, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";

interface LogEntry {
  id: number;
  no: number;
  tanggalMulai: string;
  jenisPekerjaan: string;
  department: string;
  tanggalSelesai: string;
  pic: string;
  status: "pending" | "in-progress" | "completed";
  keterangan: string;
  nomorPR: string;
}

const Home = () => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showEntryDetails, setShowEntryDetails] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    {
      id: 1,
      no: 1,
      tanggalMulai: "2023-05-10",
      jenisPekerjaan: "Network Maintenance",
      department: "IT Infrastructure",
      tanggalSelesai: "2023-05-12",
      pic: "John Doe",
      status: "completed",
      keterangan: "Replaced faulty router in server room",
      nomorPR: "PR-2023-001",
    },
    {
      id: 2,
      no: 2,
      tanggalMulai: "2023-05-15",
      jenisPekerjaan: "Software Installation",
      department: "Finance",
      tanggalSelesai: "",
      pic: "Jane Smith",
      status: "in-progress",
      keterangan: "Installing accounting software on 5 workstations",
      nomorPR: "PR-2023-002",
    },
    {
      id: 3,
      no: 3,
      tanggalMulai: "2023-05-18",
      jenisPekerjaan: "Hardware Replacement",
      department: "HR",
      tanggalSelesai: "",
      pic: "Mike Johnson",
      status: "pending",
      keterangan: "Replace 3 monitors with new LED displays",
      nomorPR: "PR-2023-003",
    },
  ]);

  const handleViewEntry = (entry: LogEntry) => {
    setSelectedEntry(entry);
    setShowEntryDetails(true);
  };

  const handleEditEntry = (entry: LogEntry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
    setShowEntryForm(true);
  };

  const handleDeleteEntry = (entry: LogEntry) => {
    // In a real application, you would confirm deletion and call an API
    setLogEntries(logEntries.filter((item) => item.id !== entry.id));
  };

  const handleFormSubmit = (data: any) => {
    if (isEditing && selectedEntry) {
      // Update existing entry
      const updatedEntries = logEntries.map((entry) =>
        entry.id === selectedEntry.id ? { ...entry, ...data } : entry,
      );
      setLogEntries(updatedEntries);
    } else {
      // Add new entry
      const newEntry = {
        id: logEntries.length + 1,
        no: logEntries.length + 1,
        tanggalMulai: data.tanggalMulai
          ? data.tanggalMulai.toISOString().split("T")[0]
          : "",
        jenisPekerjaan: data.jenisPekerjaan,
        department: data.department,
        tanggalSelesai: data.tanggalSelesai
          ? data.tanggalSelesai.toISOString().split("T")[0]
          : "",
        pic: data.pic,
        status: data.status as "pending" | "in-progress" | "completed",
        keterangan: data.keterangan || "",
        nomorPR: data.nomorPR || "",
      };
      setLogEntries([...logEntries, newEntry]);
    }

    // Close the form
    setShowEntryForm(false);
    setIsEditing(false);
    setSelectedEntry(null);
  };

  const handleFilterChange = (filters: any) => {
    // In a real application, you would filter the data based on the filters
    console.log("Filters applied:", filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">IT Log Book</h1>

          <div className="flex space-x-3">
            <Link to="/logbook">
              <Button variant="outline" className="bg-blue-50">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                IT Logbook
              </Button>
            </Link>

            <Link to="/backup-db">
              <Button variant="outline" className="bg-blue-50">
                <Database className="mr-2 h-5 w-5 text-blue-600" />
                Backup DB Logs
              </Button>
            </Link>

            <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEntry(null);
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] p-0">
                <EntryForm
                  onSubmit={handleFormSubmit}
                  initialData={
                    isEditing && selectedEntry
                      ? {
                          jenisPekerjaan: selectedEntry.jenisPekerjaan,
                          department: selectedEntry.department,
                          tanggalMulai: new Date(selectedEntry.tanggalMulai),
                          tanggalSelesai: selectedEntry.tanggalSelesai
                            ? new Date(selectedEntry.tanggalSelesai)
                            : new Date(),
                          pic: selectedEntry.pic,
                          status: selectedEntry.status,
                          keterangan: selectedEntry.keterangan,
                          nomorPR: selectedEntry.nomorPR,
                        }
                      : {}
                  }
                  isEditing={isEditing}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <FilterPanel onFilterChange={handleFilterChange} />

        <LogbookTable
          data={logEntries}
          onViewEntry={handleViewEntry}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />

        {showEntryDetails && selectedEntry && (
          <EntryDetails
            entry={selectedEntry}
            open={showEntryDetails}
            onClose={() => setShowEntryDetails(false)}
            onEdit={() => {
              setShowEntryDetails(false);
              handleEditEntry(selectedEntry);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Home;
