import { getJob } from "@/lib/prisma/jobs/getJobs";
import JobView from "@/components/views/job-view";

export default async function Page({ params }: { params: { id: string } }) {
  const job = await getJob(parseInt(params.id));
  return job && <JobView job={job} />;
}