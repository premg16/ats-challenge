"use server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addJobs(jobs: Array<{
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities: string[];
  technicalRequirements: string[];
  softSkills: string[];
  experience: string;
  education: string;
  additionalCriteria: any;
}>) {
  try {
    const newJobs = [];
    
    for (const job of jobs) {
      // Check if job already exists based on title, company, and location
      const existingJob = await prisma.jobs.findFirst({
        where: {
          AND: [
            { title: job.title },
            { company: job.company },
            { location: job.location }
          ]
        }
      });

      if (!existingJob) {
        newJobs.push(job);
      }
    }

    // Only insert jobs that don't exist
    const result = await prisma.jobs.createMany({
      data: newJobs,
    });
    
    return {
      count: result.count,
      message: `${result.count} new jobs added successfully. ${jobs.length - result.count} jobs were duplicates.`
    };
  } catch (error) {
    console.error('Error adding jobs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}