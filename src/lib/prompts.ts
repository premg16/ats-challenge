export const CV_EXTRACTION_PROMPT = `
# CV Information Extraction

## Task
Extract key information from the provided CV for a candidate matching system focused on blue-collar and sales roles. Parse the text and organize the information into the structured JSON format specified below.

## Instructions
1. Extract only information that is explicitly present in the CV
2. For missing information, use null or empty arrays as appropriate
3. Distinguish between technical skills (job-specific abilities, software, tools, machinery operation) and soft skills (interpersonal traits, communication, teamwork)
4. Organize work experience chronologically, with the most recent first
5. Be precise with dates, using full dates when available or just years if that's all that's provided
6. For responsibilities and achievements, extract key points that would be relevant for blue-collar or sales positions
7. If something is not found please put NA for that field

## Output Format
{
  "personalDetails": {
    "name": string,
    "contact": string,
    "email": string,
    "location": string
    "role": string (basically candidate's existing job title),
  },
  "skills": {
    "technical": string[],
    "soft": string[]
  },
  "experience": [
    {
      "jobTitle": string,
      "company": string,
      "location": string,
      "duration": {
        "startDate": string,
        "endDate": string
      },
      "responsibilities": string[],
      "achievements": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "year": string
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string,
      "year": string
    }
  ],
  "additionalInfo": {
    "availability": string,
    "desiredSalary": string,
    "location": string
  }
}`;

export const PROFILE_MATCHING_PROMPT = `You are an expert AI recruiter. Analyze the candidate's profile against the job requirements and provide a comprehensive evaluation.

Given the following information:

[Job Details]
{job_details}

Provide a detailed analysis in the following JSON format:
{{
    "overallScore": percentage,
    "keyMatchingHighlights": [string, string, string],
    "keyGaps": [string, string, string],
    "technicalSkillsMatch": {{
        "score": percentage,
        "matching": [string, string, string],
        "missing": [string, string, string]
    }},
    "softSkillsMatch": {{
        "score": percentage,
        "matching": [string, string, string],
        "missing": [string, string, string]
    }},
    "experienceMatch": {{
        "score": percentage,
        "matching": string,
        "gaps": string
    }},
    "educationMatch": {{
        "score": percentage,
        "matching": string,
        "gaps": string
    }},
}}

Consider:
1. Skills alignment (both technical and soft skills)
2. Experience relevance and duration
3. Education requirements
4. Overall profile fit for the role`;