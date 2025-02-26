"use server";
import { parseCV } from "@/lib/parsers";
import { calculateMatchScores } from "@/lib/matching";
import jobRolesData from "../../../resources/job-roles.json";
import { extractDetails } from "@/lib/extract";

interface JobMatch {
  jobTitle: string;
  score: number;
}

interface CandidateResult {
  candidateDetails: CandidateSchema;
  jobMatches: JobMatch[];
}

interface CandidateSchema {
  personalDetails: {
    name: string;
    contact: string;
    email: string;
    location: string;
    role: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: [
    {
      jobTitle: string;
      company: string;
      location: string;
      duration: {
        startDate: string;
        endDate: string;
      };
      responsibilities: string[];
      achievements: string[];
    }
  ];
  education: [
    {
      degree: string;
      institution: string;
      year: string;
    }
  ];
  certifications: [
    {
      name: string;
      issuer: string;
      year: string;
    }
  ];
  additionalInfo: {
    availability: string;
    desiredSalary: string;
    location: string;
  };
}

interface ProcessingResult {
  candidates: CandidateResult[];
  error?: string;
}

export async function processCVs(
  files: File[],
  provider: "openai" | "gemini"
): Promise<ProcessingResult[]> {
  console.log("processCVs");
  const results: ProcessingResult[] = [];

  try {
    const jobs = jobRolesData.jobRoles;

    await Promise.all(
      files.map(async (file) => {
        try {
          // 1. Parse CV text
          console.log("processCVs: parsing CV ", file.name);
          const cvText = await parseCV(file);
          const parsedCV = await extractDetails(cvText, provider);

          // Calculate match scores and group them
          const matchScores : JobMatch[] = await Promise.all(
            jobs.map(async (job) => ({
              jobTitle: job.title,
              score: await calculateMatchScores(parsedCV, job, provider),
            }))
          );

          // Group scores by candidate
          results.push({
            candidates: [
              {
                candidateDetails: parsedCV,
                jobMatches: matchScores,
              },
            ],
          });
        } catch (error) {
          results.push({
            candidates: [],
            error: `Failed to process CV ${file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          });
        }
      })
    );
    return results;
  } catch (error) {
    throw new Error(
      `Failed to process CVs: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
