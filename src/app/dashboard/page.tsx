"use client";
import ResultsTable from "@/components/views/results-table";
import CVUpload from "@/components/views/cv-upload";
import { useCandidateStore } from "@/lib/store/candidateStore";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProcessingResult } from "@/lib/types";

export default function Dashboard() {
    const [files, setFiles] = useState<File[]>([]);
    const { results, setResults } = useCandidateStore();

    const handleCVUpload = async (newResults: ProcessingResult[]) => {
        //  remove errors from results and return clean results object and also dont add that result to state if there is an error

        const filteredResults = newResults.filter(
            (result) => !result.error && Object.keys(result).length > 0,
        );

        const errors = newResults.filter((result) => result.error);
        if (filteredResults.length > 0) {
            setResults([...results, ...filteredResults]);
        }
        errors.forEach((error) => toast.error(error.error));
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">ATS Dashboard</h1>
                <CVUpload
                    onUpload={handleCVUpload}
                    files={files}
                    setFiles={setFiles}
                />
            </div>

            {/* Files List Section */}
            {files.length > 0 && (
                <div className="mb-8">
                    <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">
                                Uploaded Files ({files.length})
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-md bg-muted p-3 transition-colors hover:bg-muted/80"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                        <Upload
                                            size={16}
                                            className="flex-shrink-0 text-muted-foreground"
                                        />
                                        <span className="truncate text-sm">
                                            {file.name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setFiles(
                                                files.filter((f) => f !== file),
                                            )
                                        }
                                        className="ml-2 text-muted-foreground hover:text-destructive"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Table - Shows after CV upload */}
            {results.length > 0 && (
                <section className="mb-8">
                    <ResultsTable />
                </section>
            )}
        </div>
    );
}
