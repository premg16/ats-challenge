import prisma from "../../prisma";

export async function getJobs() {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getJob(id: number) {
  try {
    const job = await prisma.jobs.findUnique({
      where: { id },
    });
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}
