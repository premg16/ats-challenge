export interface JobMatch {
    jobTitle: string;
    analysis: AnalysisResult;
}

interface AnalysisResult {
    overallScore: number;
    justification: string;
    keyMatchingHighlights: [string, string, string];
    keyGaps: [string, string, string];
    technicalSkillsMatch: {
        score: number;
        matching: string[];
        missing: string[];
    };
    softSkillsMatch: {
        score: number;
        matching: string[];
        missing: string[];
    };
    experienceMatch: {
        score: number;
        matching: string;
        gaps: string;
    };
    educationMatch: {
        score: number;
        matching: string;
        gaps: string;
    };
}

export interface CandidateResult {
    candidateDetails: CandidateSchema;
    jobMatches: JobMatch[];
}

export interface CandidateSchema {
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
        },
    ];
    education: [
        {
            degree: string;
            institution: string;
            year: string;
        },
    ];
    certifications: [
        {
            name: string;
            issuer: string;
            year: string;
        },
    ];
    additionalInfo: {
        availability: string;
        desiredSalary: string;
        location: string;
    };
}

export interface ProcessingResult {
    candidate: CandidateResult[];
    error?: string;
}
