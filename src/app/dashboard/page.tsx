import { getJobs } from "@/lib/prisma/jobs/getJobs";
import DashboardView from "@/components/views/dashboard-view";

export default async function Page() {
  const jobs = await getJobs();
  return <DashboardView jobs={jobs} />;
}