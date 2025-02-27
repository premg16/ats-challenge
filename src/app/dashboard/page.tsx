"use client";
import ResultsTable from "@/components/views/results-table";
import CVUpload from "@/components/views/cv-upload";
import { useCandidateStore } from "@/lib/store/candidateStore";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Dashboard() {
  const { results, setResults } = useCandidateStore();

  const handleCVUpload = async (results: ProcessingResult[]) => {
    console.log("Results", results);
    //  remove errors from results and return clean results object
    const filteredResults = results.filter((result) => !result.error);
    const errors = results.filter((result) => result.error);
    filteredResults.length > 0 && setResults(filteredResults);
    errors.map((error) => toast.error(error.error))
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">ATS Dashboard</h1>

      {/* CV Upload Section */}
      <section className="mb-8">
        <CVUpload onUpload={handleCVUpload} />
      </section>

      {/* Results Table - Shows after CV upload */}
      {results.length > 0 && (
        <section className="mb-8">
          <ResultsTable />
        </section>
      )}
    </div>
  );
}
