import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Edit, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface LogbookTableProps {
  data?: LogEntry[];
  onViewEntry?: (entry: LogEntry) => void;
  onEditEntry?: (entry: LogEntry) => void;
  onDeleteEntry?: (entry: LogEntry) => void;
}

const LogbookTable = ({
  data = [
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
  ],
  onViewEntry = () => {},
  onEditEntry = () => {},
  onDeleteEntry = () => {},
}: LogbookTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof LogEntry | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof LogEntry) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: LogEntry["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderSortableHeader = (column: keyof LogEntry, label: string) => (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => handleSort(column)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </div>
  );

  return (
    <div className="w-full bg-white rounded-md shadow-sm border">
      <Table>
        <TableCaption>IT Logbook Entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortableHeader("no", "No")}</TableHead>
            <TableHead>
              {renderSortableHeader("tanggalMulai", "Tanggal Mulai")}
            </TableHead>
            <TableHead>
              {renderSortableHeader("jenisPekerjaan", "Jenis Pekerjaan")}
            </TableHead>
            <TableHead>
              {renderSortableHeader("department", "Department")}
            </TableHead>
            <TableHead>
              {renderSortableHeader("tanggalSelesai", "Tanggal Selesai")}
            </TableHead>
            <TableHead>{renderSortableHeader("pic", "PIC")}</TableHead>
            <TableHead>{renderSortableHeader("status", "Status")}</TableHead>
            <TableHead>
              {renderSortableHeader("keterangan", "Keterangan")}
            </TableHead>
            <TableHead>{renderSortableHeader("nomorPR", "Nomor PR")}</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-6 text-gray-500"
              >
                No entries found
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.no}</TableCell>
                <TableCell>{entry.tanggalMulai}</TableCell>
                <TableCell>{entry.jenisPekerjaan}</TableCell>
                <TableCell>{entry.department}</TableCell>
                <TableCell>{entry.tanggalSelesai || "-"}</TableCell>
                <TableCell>{entry.pic}</TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell
                  className="max-w-xs truncate"
                  title={entry.keterangan}
                >
                  {entry.keterangan}
                </TableCell>
                <TableCell>{entry.nomorPR}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex justify-end space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditEntry(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Entry</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteEntry(entry)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Entry</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10} className="text-right">
              Total Entries: {sortedData.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default LogbookTable;
