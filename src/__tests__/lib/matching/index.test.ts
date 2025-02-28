import { calculateMatchScores } from "@/lib/matching/index";
import { PromptTemplate } from "@langchain/core/prompts";
import { Gemini } from "@/lib/ai/gemini";
import { OpenAI } from "@/lib/ai/openai";
import { PROFILE_MATCHING_PROMPT } from "@/lib/prompts";

// Mock dependencies
jest.mock("@langchain/core/prompts", () => ({
    PromptTemplate: {
        fromTemplate: jest.fn().mockImplementation((template) => ({
            format: jest.fn().mockImplementation(async (values) => {
                if (template === PROFILE_MATCHING_PROMPT) {
                    return `System Prompt with ${values.job_details}`;
                } else {
                    return `Candidate Prompt with ${values.candidate_profile}`;
                }
            }),
        })),
    },
}));

jest.mock("@/lib/ai/openai", () => ({
    OpenAI: jest.fn().mockImplementation((systemPrompt, candidatePrompt) => {
        return Promise.resolve({
            score: 85,
            analysis: "OpenAI analysis result",
            matchDetails: { technical: 80, softSkills: 90 },
        });
    }),
}));

jest.mock("@/lib/ai/gemini", () => ({
    Gemini: jest.fn().mockImplementation((systemPrompt, candidatePrompt) => {
        return Promise.resolve({
            score: 75,
            analysis: "Gemini analysis result",
            matchDetails: { technical: 70, softSkills: 80 },
        });
    }),
}));

jest.mock("@/lib/prompts", () => ({
    PROFILE_MATCHING_PROMPT: "Mock profile matching prompt template",
}));

describe("calculateMatchScores", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCV = {
        name: "John Doe",
        skills: ["JavaScript", "TypeScript", "React"],
        experience: [{ company: "Tech Co", role: "Developer", years: 3 }],
        education: [
            { degree: "Computer Science", institution: "Tech University" },
        ],
    };

    const mockJob = {
        title: "Senior Developer",
        company: "ABC Corp",
        location: "Remote",
        description: "Looking for a senior developer",
        technicalRequirements: ["JavaScript", "TypeScript", "React"],
        softSkills: ["Communication", "Teamwork"],
        experience: "3+ years",
        education: "Bachelor's degree",
        responsibilities: ["Develop web applications", "Code reviews"],
        additionalCriteria: "Knowledge of cloud platforms",
    };

    test("should call OpenAI with correct parameters when provider is openai", async () => {
        const result = await calculateMatchScores(mockCV, mockJob, "openai");

        // Verify PromptTemplate was called correctly
        expect(PromptTemplate.fromTemplate).toHaveBeenCalledWith(
            PROFILE_MATCHING_PROMPT,
        );
        expect(PromptTemplate.fromTemplate).toHaveBeenCalledWith(
            `[Candidate Profile]
    {candidate_profile}`,
        );

        // Verify OpenAI was called with correct parameters
        expect(OpenAI).toHaveBeenCalledWith(
            expect.stringContaining("System Prompt with"),
            expect.stringContaining("Candidate Prompt with"),
        );

        // Verify Gemini was not called
        expect(Gemini).not.toHaveBeenCalled();

        // Verify result
        expect(result).toEqual({
            score: 85,
            analysis: "OpenAI analysis result",
            matchDetails: { technical: 80, softSkills: 90 },
        });
    });

    test("should call Gemini with correct parameters when provider is gemini", async () => {
        const result = await calculateMatchScores(mockCV, mockJob, "gemini");

        // Verify PromptTemplate was called correctly
        expect(PromptTemplate.fromTemplate).toHaveBeenCalledWith(
            PROFILE_MATCHING_PROMPT,
        );
        expect(PromptTemplate.fromTemplate).toHaveBeenCalledWith(
            `[Candidate Profile]
    {candidate_profile}`,
        );

        // Verify Gemini was called with correct parameters
        expect(Gemini).toHaveBeenCalledWith(
            expect.stringContaining("System Prompt with"),
            expect.stringContaining("Candidate Prompt with"),
        );

        // Verify OpenAI was not called
        expect(OpenAI).not.toHaveBeenCalled();

        // Verify result
        expect(result).toEqual({
            score: 75,
            analysis: "Gemini analysis result",
            matchDetails: { technical: 70, softSkills: 80 },
        });
    });

    test("should throw error for invalid provider", async () => {
        // Using a type assertion to create an invalid provider type
        await expect(
            calculateMatchScores(
                mockCV,
                mockJob,
                "invalid" as "openai" | "gemini",
            ),
        ).rejects.toThrow("Invalid provider");

        // Verify neither OpenAI nor Gemini was called
        expect(OpenAI).not.toHaveBeenCalled();
        expect(Gemini).not.toHaveBeenCalled();
    });

    test("should format job details correctly", async () => {
        await calculateMatchScores(mockCV, mockJob, "openai");

        // The issue is here - we need to properly access the mock calls
        const promptTemplateMock = PromptTemplate.fromTemplate as jest.Mock;
        const systemTemplateInstance = promptTemplateMock.mock.results[0].value;
        const formatMock = systemTemplateInstance.format as jest.Mock;
        const formatCall = formatMock.mock.calls[0][0];

        // Verify job details were formatted correctly
        const jobDetailsJson = formatCall.job_details;
        const parsedJobDetails = JSON.parse(jobDetailsJson);

        expect(parsedJobDetails).toEqual({
            title: mockJob.title,
            company: mockJob.company,
            location: mockJob.location,
            description: mockJob.description,
            technicalRequirements: mockJob.technicalRequirements,
            softSkills: mockJob.softSkills,
            experience: mockJob.experience,
            education: mockJob.education,
            responsibilities: mockJob.responsibilities,
            additionalCriteria: mockJob.additionalCriteria,
        });
    });

    test("should format candidate profile correctly", async () => {
        await calculateMatchScores(mockCV, mockJob, "openai");

        // Get the second template creation call (for candidate profile)
        const promptTemplateMock = PromptTemplate.fromTemplate as jest.Mock;
        const candidateTemplateCall = promptTemplateMock.mock.calls[1][0];
        expect(candidateTemplateCall).toBe(`[Candidate Profile]
    {candidate_profile}`);

        // Get the format call for the candidate template
        const formatMock = promptTemplateMock.mock.results[1].value
            .format as jest.Mock;
        const formatCall = formatMock.mock.calls[0][0];

        // Verify candidate profile was formatted correctly
        const candidateProfileJson = formatCall.candidate_profile;
        const parsedCandidateProfile = JSON.parse(candidateProfileJson);

        expect(parsedCandidateProfile).toEqual(mockCV);
    });
});
