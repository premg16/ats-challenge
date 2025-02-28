"use server";
import { parseCV } from "@/lib/parsers";
import { calculateMatchScores } from "@/lib/matching";
import jobRolesData from "../../../resources/job-roles.json";
import { extractDetails } from "@/lib/extract";
import { JobMatch, ProcessingResult } from "@/lib/types";

export async function processCVs(
    files: File[],
    provider: "openai" | "gemini",
): Promise<ProcessingResult[]> {

    const results: ProcessingResult[] = [];

    try {
        const jobs = jobRolesData.jobRoles;

        await Promise.all(
            files.map(async (file) => {
                try {
                    // 1. Parse CV text

                    const cvText = await parseCV(file);
                    const parsedCV = await extractDetails(cvText, provider);

                    // Calculate match scores and group them
                    const analysis: JobMatch[] = await Promise.all(
                        jobs.map(async (job) => ({
                            jobTitle: job.title,
                            analysis: await calculateMatchScores(
                                parsedCV,
                                job,
                                provider,
                            ),
                        })),
                    );

                    // Group scores by candidate
                    results.push({
                        candidate: [
                            {
                                candidateDetails: parsedCV,
                                jobMatches: analysis,
                            },
                        ],
                    });
                } catch (error) {
                    results.push({
                        candidate: [],
                        error: `Failed to process CV ${file.name}: ${
                            error instanceof Error
                                ? error.message
                                : "Unknown error"
                        }`,
                    });
                }
            }),
        );

        return results;
    } catch (error) {
        throw new Error(
            `Failed to process CVs: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        );
    }
}
