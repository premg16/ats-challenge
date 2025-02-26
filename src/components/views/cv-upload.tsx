"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { processCVs } from "@/app/actions/cv-processing";

interface CVUploadProps {
  onUpload: (results: any[]) => void;
}

export default function CVUpload({ onUpload }: CVUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (newFiles: File[]) => {
    // Remove duplicates based on name and last modified time
    const existingFileKeys = new Set(
      files.map(file => `${file.name}-${file.lastModified}`)
    );

    return newFiles.filter((file) => {
      const fileKey = `${file.name}-${file.lastModified}`;
      const isValid = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file.type);

      if (!isValid) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }

      if (existingFileKeys.has(fileKey)) {
        toast.error(`${file.name} is already added`);
        return false;
      }

      return true;
    });
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = validateFiles(newFiles);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected! Please select at least one file");
      return;
    }
    setUploading(true);
    try {
      const results = await processCVs(files, provider);
      onUpload(results);
      toast.success("CVs processed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error processing CVs");
    } finally {
      setUploading(false);
      setFiles([]); // Clear files after successful processing
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-brand-white dark:bg-brand-dark">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload CVs</h3>
        <Select
          value={provider}
          onValueChange={(value: "openai" | "gemini") => setProvider(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select AI Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="gemini">Google Gemini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center space-y-4 transition-colors",
          isDragging && "border-primary bg-muted",
          "hover:border-primary hover:bg-muted"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="cv-upload"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label
          htmlFor="cv-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload
            className={cn(
              "w-8 h-8",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isDragging
              ? "Drop files here"
              : "Drag & drop or click to upload CVs"}
          </span>
          <span className="text-xs text-muted-foreground">
            Supported formats: PDF, DOCX, TXT
          </span>
        </label>
      </div>

      <Button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          </>
        ) : (
          "Process CVs"
        )}
      </Button>
    </div>
  );
}
