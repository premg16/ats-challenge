"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, MapPin, Users, SearchX, Upload } from "lucide-react";
import { JobWithCount } from "@/lib/types/job";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addJobs } from "@/lib/prisma/jobs/addJobs";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface JobsGridProps {
  jobs: JobWithCount[];
}

export default function JobsGrid({ jobs }: JobsGridProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleJobClick = (jobId: number) => {
    router.push(`/dashboard/job/${jobId}`);
  };
  
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      await processJsonFile(file);
    } else {
      toast.error("Please drop a JSON file");
    }
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".json")) {
      await processJsonFile(file);
    }
  };
  
  const processJsonFile = async (file: File) => {
    try {
      const content = await file.text();
      const { jobRoles } = JSON.parse(content);
      await addJobs(jobRoles);
      toast.success("Jobs added successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Please ensure you've uploaded a valid JSON file.");
      alert("Error processing file. Please ensure it's a valid JSON file.");
    }
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      className="flex flex-col h-full"
    >
      {/* Header - Fixed part */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold animate-in slide-in-from-left duration-500">
          Available Positions
        </h2>
        <div className="relative">
          <Button>
            <Label
              htmlFor="file-upload"
              className="flex gap-2 items-center cursor-pointer"
            >
              <Upload size={16} />
              <span>Add Jobs</span>
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </Button>
        </div>
      </div>

      {/* Scrollable grid container */}
      <div className="relative flex-1 min-h-0"> {/* min-h-0 is critical for flex child to scroll */}
        {isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-brand-green rounded-lg flex items-center justify-center bg-background/50 z-10">
            <p className="text-lg font-medium">Drop JSON file here</p>
          </div>
        )}
        
        {/* Scrollable area with styled scrollbar */}
        <div
          className={`h-full overflow-y-auto pr-2 
            scrollbar-thin scrollbar-thumb-brand-green 
            scrollbar-track-transparent hover:scrollbar-thumb-brand-green/80 scrollbar-thumb-rounded-full
            ${isDragging ? "opacity-50" : ""}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 pb-4">
            {jobs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <SearchX className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Positions Found</h3>
                <p>Drop a JSON file or click Add Jobs to get started.</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  className={`cursor-pointer animate-in fade-in zoom-in duration-700 hover:scale-[1.02] transition-transform`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full hover:bg-brand-green/10">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span>{job.title}</span>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-4 h-4" />
                          <span>{job._count.applications} applicants</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}