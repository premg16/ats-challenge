"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

import Notifications from "./notifications";
import { Sun, Moon, X, Upload } from "lucide-react";
import Modal from "./modal";
import { addJobRoles } from "@/lib/prisma/addJobs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "./label";

const FileUploadSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file" }),
  uploadType: z.enum(["json", "csv", "excel"], {
    required_error: "Please select a file type",
  }),
});
// Update the JobFormSchema to match Prisma schema
const JobFormSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.array(z.string()).default([]),
  technicalRequirements: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
  experience: z.string().min(1, "Experience level is required"),
  education: z.string().default(""),
  additionalCriteria: z.object({
    hourlyRate: z.string().default(""),
    shiftTiminig: z.string().default(""),
  }),
});
type FileUploadForm = z.infer<typeof FileUploadSchema>;
type JobForm = z.infer<typeof JobFormSchema>;

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileForm = useForm<FileUploadForm>({
    resolver: zodResolver(FileUploadSchema),
  });

  const jobForm = useForm<JobForm>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      responsibilities: [],
      technicalRequirements: [],
      softSkills: [],
      title: "",
      company: "",
      location: "",
      description: "",
      experience: "",
      education: "",
      additionalCriteria: {
        hourlyRate: "",
        shiftTiminig: "",
      },
    },
  });

  const handleAddJobClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fileForm.reset();
    jobForm.reset();
  };

  const handleFileSubmit = async (data: FileUploadForm) => {
    try {
      let jobData;

      if (data.uploadType === "excel") {
        const arrayBuffer = await data.file.arrayBuffer();
        // Here you would use a library like xlsx to parse Excel files
        // For example: const workbook = XLSX.read(arrayBuffer);
        throw new Error("Excel parsing not implemented");
      }

      const fileContent = await data.file.text();

      switch (data.uploadType) {
        case "json":
          try {
            const { jobRoles } = JSON.parse(fileContent);
            jobData = jobRoles ;
          } catch (e) {
            throw new Error("Invalid JSON format");
          }
          break;

        case "csv":
          try {
            // Handle CSV with potential quoted values and escaped commas
            const parseCSVLine = (line: string) => {
              const values = [];
              let current = "";
              let inQuotes = false;

              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === "," && !inQuotes) {
                  values.push(current.trim());
                  current = "";
                } else {
                  current += char;
                }
              }
              values.push(current.trim());
              return values;
            };

            const rows = fileContent.split(/\r?\n/).filter((row) => row.trim());
            const headers = parseCSVLine(rows[0]);

            jobData = rows.slice(1).map((row) => {
              const values = parseCSVLine(row);
              return headers.reduce((obj: any, header, index) => {
                const cleanHeader = header.replace(/^["']|["']$/g, "").trim();
                obj[cleanHeader] =
                  values[index]?.replace(/^["']|["']$/g, "").trim() || "";
                return obj;
              }, {});
            });
          } catch (e) {
            throw new Error("Invalid CSV format");
          }
          break;

        default:
          throw new Error(`Unsupported file type: ${data.uploadType}`);
      }

      // Validate and format job data
      if (!Array.isArray(jobData)) {
        jobData = [jobData];
      }

      const formattedJobs = jobData.map((job: any) => {
        // Ensure required fields exist
        if (!job.title) {
          throw new Error("Job title is required");
        }
        if (!job.company) {
          throw new Error("Company name is required");
        }

        return {
          title: job.title,
          company: job.company,
          location: job.location || "",
          description: job.description || "",
          responsibilities: Array.isArray(job.responsibilities)
            ? job.responsibilities
            : job.responsibilities
            ? [job.responsibilities]
            : [],
          technicalRequirements: Array.isArray(job.technicalRequirements)
            ? job.technicalRequirements
            : job.technicalRequirements
            ? [job.technicalRequirements]
            : [],
          softSkills: Array.isArray(job.softSkills)
            ? job.softSkills
            : job.softSkills
            ? [job.softSkills]
            : [],
          experience: job.experience || job.experienceLevel || "",
          education: job.education || "",
          additionalCriteria: {
            hourlyRate: job.hourlyRate || "",
            shiftTimings: job.shiftTimings || "",
          },
        };
      });

      await addJobRoles(formattedJobs);
      handleCloseModal();
    } catch (error) {
      console.error("Error processing file:", error);
      // Here you might want to show an error message to the user
      throw error;
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2">
          <img src="/logo.png" alt="Logo" />
        </div>
        <span className="font-bold text-xl text-foreground">Recruit Raid</span>
      </div>

      <div className="flex-1 mx-4">
        <Input type="text" placeholder="Search" className="w-full" />
      </div>

      <div className="flex items-center space-x-4">
        <Button
          className="bg-brand-green hover:bg-brand-green/90 text-white"
          onClick={handleAddJobClick}
        >
          Add Job
        </Button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Notifications />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            alt="Profile"
          />
          <AvatarFallback className="bg-muted text-muted-foreground">
            CN
          </AvatarFallback>
        </Avatar>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="bg-background p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center border-b pb-3 gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              Add New Job
            </h2>
            <button onClick={handleCloseModal} aria-label="Close">
              <X
                size={20}
                className="text-muted-foreground hover:text-destructive transition-colors"
              />
            </button>
          </div>
          <div>
            <h3 className="text-md font-medium text-foreground mb-2">
              Upload Job File
            </h3>
            <Form {...fileForm}>
              <form
                onSubmit={fileForm.handleSubmit(handleFileSubmit)}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <FormField
                    control={fileForm.control}
                    name="uploadType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Label
                              htmlFor="file-upload"
                              className="flex items-center gap-2 cursor-pointer bg-secondary p-4 rounded-lg border-2 border-dashed border-muted-foreground hover:border-primary transition-colors"
                            >
                              <Upload size={16} className="mr-2" />
                              Click to select a file (.json, .csv, or .excel)
                            </Label>
                            <Input
                              id="file-upload"
                              type="file"
                              accept=".json,.csv,.xlsx,.xls"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileExtension = file.name
                                    .split(".")
                                    .pop()
                                    ?.toLowerCase();
                                  if (
                                    fileExtension === "json" ||
                                    fileExtension === "csv" ||
                                    fileExtension === "xlsx" ||
                                    fileExtension === "xls"
                                  ) {
                                    fileForm.setValue("file", file);
                                    field.onChange(
                                      fileExtension === "xlsx" ||
                                        fileExtension === "xls"
                                        ? "excel"
                                        : (fileExtension as
                                            | "json"
                                            | "csv"
                                            | "excel")
                                    );
                                  }
                                }
                              }}
                              className="hidden"
                            />
                            <Button
                              type="submit"
                              className="bg-brand-green hover:bg-brand-green/90 text-white w-full"
                            >
                              <Upload size={16} className="mr-2" />
                              Upload Selected File
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Modal>
    </header>
  );
}
