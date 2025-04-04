import React, { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  status: string;
  department: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const FilterPanel = ({ onFilterChange }: FilterPanelProps = {}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all-statuses",
    department: "all-departments",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    const newFilters = { ...filters, dateRange: range };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      status: "all-statuses",
      department: "all-departments",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="w-full bg-white p-4 shadow-sm rounded-md mb-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by any field..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.department}
            onValueChange={(value) => handleFilterChange("department", value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">All Departments</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !filters.dateRange.from &&
                    !filters.dateRange.to &&
                    "text-muted-foreground",
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "PPP")} -{" "}
                      {format(filters.dateRange.to, "PPP")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "PPP")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* Calendar component implementation would go here */}
              <div className="p-3">
                <p className="text-sm text-center text-muted-foreground">
                  Date picker placeholder
                </p>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleDateRangeChange({ from: undefined, to: undefined })
                    }
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const nextWeek = new Date();
                      nextWeek.setDate(today.getDate() + 7);
                      handleDateRangeChange({ from: today, to: nextWeek });
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="outline"
          onClick={clearFilters}
          className="whitespace-nowrap"
        >
          <Filter className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
