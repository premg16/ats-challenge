"use server"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addJobRoles(jobRoles: Array<{
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
    // Insert job roles into the database
    console.log("jobRoles", jobRoles);
    const result = await prisma.jobRole.createMany({
      data: jobRoles,
      skipDuplicates: true, // Optional: skips duplicates based on unique constraints
    });
    console.log(`${result.count} job roles added successfully.`);
  } catch (error) {
    console.error('Error adding job roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}