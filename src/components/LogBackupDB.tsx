import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  tanggal: z.date({
    required_error: "Tanggal is required.",
  }),
  shift: z.enum(["pagi", "siang", "sore"], {
    required_error: "Please select a shift.",
  }),
  pic: z.string().min(2, {
    message: "PIC must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface LogBackupDBProps {
  onSubmit?: (data: FormValues) => void;
  initialData?: Partial<FormValues>;
}

const LogBackupDB = ({
  onSubmit = () => {},
  initialData = {},
}: LogBackupDBProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: initialData.tanggal || new Date(),
      shift: initialData.shift || "pagi",
      pic: initialData.pic || "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Create a new date at noon to avoid timezone issues
    const date = values.tanggal;
    const selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
    );
    onSubmit({
      ...values,
      tanggal: selectedDate,
    });
    console.log("Submitting with date:", selectedDate);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
        Log BackupDB
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shift"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Shift</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pagi" id="pagi" />
                      <Label htmlFor="pagi">Pagi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="siang" id="siang" />
                      <Label htmlFor="siang">Siang</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sore" id="sore" />
                      <Label htmlFor="sore">Sore</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIC</FormLabel>
                <FormControl>
                  <Input placeholder="Enter person in charge" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8"
            >
              SUBMIT
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LogBackupDB;
