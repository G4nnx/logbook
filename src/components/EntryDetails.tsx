import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Printer, Edit, X } from "lucide-react";

interface EntryDetailsProps {
  entry?: {
    id: number;
    jenisPekerjaan: string;
    department: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    pic: string;
    status: "pending" | "in-progress" | "completed";
    keterangan: string;
    nomorPR: string;
  };
  onClose?: () => void;
  onEdit?: () => void;
  open?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

const EntryDetails: React.FC<EntryDetailsProps> = ({
  entry = {
    id: 1,
    jenisPekerjaan: "Network Maintenance",
    department: "IT Infrastructure",
    tanggalMulai: "2023-06-15",
    tanggalSelesai: "2023-06-18",
    pic: "John Doe",
    status: "completed",
    keterangan:
      "Routine maintenance of network equipment in Building A. Replaced faulty router and updated firmware on all switches.",
    nomorPR: "PR-2023-0042",
  },
  onClose = () => {},
  onEdit = () => {},
  open = true,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Task Details</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{entry.jenisPekerjaan}</CardTitle>
              <Badge className={getStatusColor(entry.status)}>
                {getStatusText(entry.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-sm">{entry.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">PIC</p>
                <p className="text-sm">{entry.pic}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-sm">{entry.tanggalMulai}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-sm">{entry.tanggalSelesai}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">PR Number</p>
                <p className="text-sm">{entry.nomorPR}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Task ID</p>
                <p className="text-sm">#{entry.id}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Description
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm whitespace-pre-line">
                  {entry.keterangan}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDetails;
