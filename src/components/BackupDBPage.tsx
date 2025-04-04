import React, { useState, useEffect } from "react";
import LogBackupDB from "./LogBackupDB";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";
import Header from "./Header";
import { saveBackupLog, getBackupLogs, BackupLogData } from "../api/backupLogs";
import { useToast } from "../components/ui/use-toast";

interface BackupLogEntry {
  tanggal: Date;
  shift: "pagi" | "siang" | "sore";
  pic: string;
  id?: string;
  timestamp: string;
}

const BackupDBPage = () => {
  const [logs, setLogs] = useState<BackupLogData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getBackupLogs();
      if (response.success) {
        setLogs(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch logs",
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

  const handleSubmit = async (
    data: Omit<BackupLogEntry, "id" | "timestamp">,
  ) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const newEntry = {
      ...data,
      timestamp: timeString,
    };

    try {
      const response = await saveBackupLog(newEntry);
      if (response.success) {
        setLogs((prev) => [response.data, ...prev]);
        toast({
          title: "Success",
          description: "Backup log saved successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to save backup log",
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

  const exportToExcel = () => {
    // Format the data for Excel
    const formattedData = logs.map((log) => ({
      Tanggal: new Date(log.tanggal).toLocaleDateString(),
      Waktu: log.timestamp,
      Shift: log.shift,
      PIC: log.pic,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Backup Logs");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "backup_logs.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Database Backup Logs
          </h1>
          <Button
            onClick={exportToExcel}
            disabled={logs.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Export to Excel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <LogBackupDB onSubmit={handleSubmit} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Logs</h2>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-500">
                No logs yet. Add a new entry to get started.
              </p>
            ) : (
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Tanggal</th>
                      <th className="border p-2 text-left">Waktu</th>
                      <th className="border p-2 text-left">Shift</th>
                      <th className="border p-2 text-left">PIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="border p-2">
                          {new Date(
                            log.tanggal + "T12:00:00", // Use noon to avoid timezone issues
                          ).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{log.timestamp}</td>
                        <td className="border p-2 capitalize">{log.shift}</td>
                        <td className="border p-2">{log.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupDBPage;
