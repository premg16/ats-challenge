"use client"

import JobsGrid from "@/components/views/jobs-grid";
import { JobWithCount } from "@/lib/types/job";

interface DashboardViewProps {
  jobs: JobWithCount[];
}

export default function DashboardView({ jobs }: DashboardViewProps) {
  return (
    <main className="animate-in fade-in duration-1000 h-[calc(100vh-4.5rem)]"> {/* Adjust 64px to match your header height */}
      <div className="mx-auto p-6 animate-in slide-in-from-bottom-8 duration-700 delay-200 h-full">
        <JobsGrid jobs={jobs} />
      </div>
    </main>
  );
}