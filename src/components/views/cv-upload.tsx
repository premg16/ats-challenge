"use client";

import {
    useState,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
    useCallback,
} from "react";
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
import { processCVs } from "@/app/actions/cv-processing";
import { Input } from "../ui/input";
import { ProcessingResult } from "@/lib/types";

interface CVUploadProps {
    onUpload: (results: ProcessingResult[]) => void;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}

export default function CVUpload({ onUpload, files, setFiles }: CVUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [provider, setProvider] = useState<"openai" | "gemini">("openai");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = useCallback(
        (newFiles: File[]) => {
            // Remove duplicates based on name and last modified time
            const existingFileKeys = new Set(
                files.map((file) => `${file.name}-${file.lastModified}`),
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
        },
        [files],
    );

    const addFiles = useCallback(
        (newFiles: File[]) => {
            const validFiles = validateFiles(newFiles);
            if (validFiles.length > 0) {
                setFiles((prev) => [...prev, ...validFiles]);
            }
        },
        [validateFiles, setFiles],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        addFiles(selectedFiles);
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

    useEffect(() => {
        const handleWindowDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) setIsDragging(true);
        };

        const handleWindowDragLeave = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Only set isDragging to false if we're leaving the window
            if (
                e.clientY <= 0 ||
                e.clientX <= 0 ||
                e.clientY >= window.innerHeight ||
                e.clientX >= window.innerWidth
            ) {
                setIsDragging(false);
            }
        };

        const handleWindowDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const droppedFiles = Array.from(e.dataTransfer?.files || []);
            addFiles(droppedFiles);
        };

        // Add event listeners
        window.addEventListener("dragover", handleWindowDragOver);
        window.addEventListener("dragleave", handleWindowDragLeave);
        window.addEventListener("drop", handleWindowDrop);

        // Cleanup
        return () => {
            window.removeEventListener("dragover", handleWindowDragOver);
            window.removeEventListener("dragleave", handleWindowDragLeave);
            window.removeEventListener("drop", handleWindowDrop);
        };
    }, [isDragging, addFiles]);

    return (
        <>
            {isDragging && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="rounded-lg border-2 border-dashed border-primary bg-background/50 p-12">
                        <Upload className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <p className="text-center text-lg font-medium">
                            Drop your files here
                        </p>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-4">
                <Select
                    value={provider}
                    onValueChange={(value: "openai" | "gemini") =>
                        setProvider(value)
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select AI" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    ref={fileInputRef}
                    type="file"
                    id="cv-upload"
                    multiple
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                />

                <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="default"
                    disabled={uploading}
                >
                    <Upload size={16} className="mr-2" />
                    Upload CVs
                </Button>

                {files.length > 0 && (
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="mr-2 animate-spin"
                                />
                                Processing...
                            </>
                        ) : (
                            "Process CVs"
                        )}
                    </Button>
                )}
            </div>
        </>
    );
}
