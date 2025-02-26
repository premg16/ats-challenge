"use client";
import { useState } from "react";
import ResultsTable from "@/components/views/results-table";
import CVUpload from "@/components/views/cv-upload";

export default function Home() {
  const [matchResults, setMatchResults] = useState<any[]>([]);

  const handleCVUpload = async (results: any[]) => {
    setMatchResults(results); // Store the results directly
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ATS Dashboard</h1>

      {/* CV Upload Section */}
      <section className="mb-8">
        <CVUpload onUpload={handleCVUpload} />
      </section>

      {/* Results Table - Shows after CV upload */}
      {matchResults.length > 0 && (
        <section className="mb-8">
          <ResultsTable results={matchResults} />
        </section>
      )}
    </div>
  );
}
