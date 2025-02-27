import { PromptTemplate } from "@langchain/core/prompts";
import { Gemini } from "../ai/gemini";
import { OpenAI } from "../ai/openai";
import { PROFILE_MATCHING_PROMPT } from "../prompts";


export async function calculateMatchScores(
  cv: any,
  job: any,
  provider: "openai" | "gemini"
): Promise< any> {
  const jobDetails = {
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    technicalRequirements: job.technicalRequirements,
    softSkills: job.softSkills,
    experience: job.experience,
    education: job.education,
    responsibilities: job.responsibilities,
    additionalCriteria: job.additionalCriteria,
  };

  const matchingSystemTemplate = PromptTemplate.fromTemplate(PROFILE_MATCHING_PROMPT);

  const formattedSystemPrompt = await matchingSystemTemplate.format({
    job_details: JSON.stringify(jobDetails, null, 2),
  });

  const matchingCandidateTemplate = PromptTemplate.fromTemplate(
    `[Candidate Profile]
    {candidate_profile}`
  );

  const formattedCandidatePrompt = await matchingCandidateTemplate.format({
    candidate_profile: JSON.stringify(cv, null, 2),
  });



  let analysis;
  switch(provider) {
    case 'openai':
      analysis = await OpenAI(formattedSystemPrompt, formattedCandidatePrompt);
      break;
    case 'gemini':
      analysis = await Gemini(formattedSystemPrompt, formattedCandidatePrompt);
      break;
    default:
      throw new Error('Invalid provider');
  }

  return analysis;
}
