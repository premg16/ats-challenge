import { processCVs } from "@/app/actions/cv-processing";
import { parseCV } from "@/lib/parsers";
import { extractDetails } from "@/lib/extract";
import { calculateMatchScores } from "@/lib/matching";
import jobRolesData from "../../../../resources/job-roles.json";

// Mock dependencies
jest.mock("@/lib/parsers", () => ({
    parseCV: jest.fn(),
}));

jest.mock("@/lib/extract", () => ({
    extractDetails: jest.fn(),
}));

jest.mock("@/lib/matching", () => ({
    calculateMatchScores: jest.fn(),
}));

// Mock job roles data
jest.mock("../../../../resources/job-roles.json", () => ({
    jobRoles: [
        {
            title: "Software Engineer",
            company: "Test Company",
            location: "Remote",
            description: "Test job description",
            technicalRequirements: ["JavaScript", "React"],
            softSkills: ["Communication"],
            experience: "3+ years",
            education: "Bachelor's degree",
            responsibilities: ["Develop web applications"],
            additionalCriteria: "Knowledge of cloud platforms",
        },
        {
            title: "Product Manager",
            company: "Test Company",
            location: "Remote",
            description: "Test job description",
            technicalRequirements: ["Agile", "Jira"],
            softSkills: ["Leadership"],
            experience: "5+ years",
            education: "Bachelor's degree",
            responsibilities: ["Product roadmap"],
            additionalCriteria: "Experience with SaaS products",
        },
    ],
}));

describe("processCVs", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to create a mock File
    function createMockFile(name: string, type: string) {
        return {
            name,
            type,
        } as unknown as File;
    }

    // Mock data for tests
    const mockCVText = "This is a sample CV text";
    const mockParsedCV = {
        personalDetails: {
            name: "John Doe",
            contact: "123-456-7890",
            email: "john@example.com",
            location: "New York",
            role: "Software Engineer",
        },
        skills: {
            technical: ["JavaScript", "React", "Node.js"],
            soft: ["Communication", "Teamwork"],
        },
        experience: [
            {
                jobTitle: "Software Engineer",
                company: "Tech Co",
                location: "New York",
                duration: {
                    startDate: "2020-01",
                    endDate: "2023-01",
                },
                responsibilities: ["Developed web applications"],
                achievements: ["Improved performance by 30%"],
            },
        ],
        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Technology",
                year: "2019",
            },
        ],
        certifications: [
            {
                name: "AWS Certified Developer",
                issuer: "Amazon Web Services",
                year: "2021",
            },
        ],
        additionalInfo: {
            availability: "Immediate",
            desiredSalary: "$100,000",
            location: "Remote",
        },
    };

    const mockAnalysisResult = {
        overallScore: 85,
        justification: "Strong match for the role",
        keyMatchingHighlights: ["JavaScript", "React", "Communication"] as [
            string,
            string,
            string,
        ],
        keyGaps: ["TypeScript", "GraphQL", "AWS"] as [string, string, string],
        technicalSkillsMatch: {
            score: 80,
            matching: ["JavaScript", "React"],
            missing: ["TypeScript"],
        },
        softSkillsMatch: {
            score: 90,
            matching: ["Communication"],
            missing: ["Leadership"],
        },
        experienceMatch: {
            score: 85,
            matching: "3+ years of relevant experience",
            gaps: "No experience with cloud platforms",
        },
        educationMatch: {
            score: 100,
            matching: "Bachelor's degree in Computer Science",
            gaps: "",
        },
    };

    it("should process CVs successfully with OpenAI provider", async () => {
        // Setup mocks
        const mockFile = createMockFile("resume.pdf", "application/pdf");
        (parseCV as jest.Mock).mockResolvedValue(mockCVText);
        (extractDetails as jest.Mock).mockResolvedValue(mockParsedCV);
        (calculateMatchScores as jest.Mock).mockResolvedValue(
            mockAnalysisResult,
        );

        // Call the function
        const results = await processCVs([mockFile], "openai");

        // Verify the mocks were called correctly
        expect(parseCV).toHaveBeenCalledWith(mockFile);
        expect(extractDetails).toHaveBeenCalledWith(mockCVText, "openai");
        expect(calculateMatchScores).toHaveBeenCalledTimes(2); // Once for each job role
        expect(calculateMatchScores).toHaveBeenCalledWith(
            mockParsedCV,
            jobRolesData.jobRoles[0],
            "openai",
        );
        expect(calculateMatchScores).toHaveBeenCalledWith(
            mockParsedCV,
            jobRolesData.jobRoles[1],
            "openai",
        );

        // Verify the results structure
        expect(results).toHaveLength(1);
        expect(results[0].candidate).toHaveLength(1);
        expect(results[0].candidate[0].candidateDetails).toEqual(mockParsedCV);
        expect(results[0].candidate[0].jobMatches).toHaveLength(2); // Two job roles
        expect(results[0].candidate[0].jobMatches[0].jobTitle).toBe(
            "Software Engineer",
        );
        expect(results[0].candidate[0].jobMatches[0].analysis).toEqual(
            mockAnalysisResult,
        );
        expect(results[0].candidate[0].jobMatches[1].jobTitle).toBe(
            "Product Manager",
        );
        expect(results[0].candidate[0].jobMatches[1].analysis).toEqual(
            mockAnalysisResult,
        );
    });

    it("should process CVs successfully with Gemini provider", async () => {
        // Setup mocks
        const mockFile = createMockFile("resume.pdf", "application/pdf");
        (parseCV as jest.Mock).mockResolvedValue(mockCVText);
        (extractDetails as jest.Mock).mockResolvedValue(mockParsedCV);
        (calculateMatchScores as jest.Mock).mockResolvedValue(
            mockAnalysisResult,
        );

        // Call the function
        const results = await processCVs([mockFile], "gemini");

        // Verify the mocks were called correctly
        expect(parseCV).toHaveBeenCalledWith(mockFile);
        expect(extractDetails).toHaveBeenCalledWith(mockCVText, "gemini");
        expect(calculateMatchScores).toHaveBeenCalledTimes(2); // Once for each job role
        expect(calculateMatchScores).toHaveBeenCalledWith(
            mockParsedCV,
            jobRolesData.jobRoles[0],
            "gemini",
        );
        expect(calculateMatchScores).toHaveBeenCalledWith(
            mockParsedCV,
            jobRolesData.jobRoles[1],
            "gemini",
        );

        // Verify the results structure
        expect(results).toHaveLength(1);
        expect(results[0].candidate).toHaveLength(1);
        expect(results[0].candidate[0].candidateDetails).toEqual(mockParsedCV);
        expect(results[0].candidate[0].jobMatches).toHaveLength(2); // Two job roles
    });

    it("should handle CV parsing errors", async () => {
        // Setup mocks
        const mockFile = createMockFile("resume.pdf", "application/pdf");
        (parseCV as jest.Mock).mockRejectedValue(
            new Error("PDF parsing failed"),
        );

        // Call the function
        const results = await processCVs([mockFile], "openai");

        // Verify error handling
        expect(results).toHaveLength(1);
        expect(results[0].candidate).toHaveLength(0);
        expect(results[0].error).toBe(
            "Failed to process CV resume.pdf: PDF parsing failed",
        );
    });

    it("should handle extraction errors", async () => {
        // Setup mocks
        const mockFile = createMockFile("resume.pdf", "application/pdf");
        (parseCV as jest.Mock).mockResolvedValue(mockCVText);
        (extractDetails as jest.Mock).mockRejectedValue(
            new Error("Extraction failed"),
        );

        // Call the function
        const results = await processCVs([mockFile], "openai");

        // Verify error handling
        expect(results).toHaveLength(1);
        expect(results[0].candidate).toHaveLength(0);
        expect(results[0].error).toBe(
            "Failed to process CV resume.pdf: Extraction failed",
        );
    });

    it("should handle match scoring errors", async () => {
        // Setup mocks
        const mockFile = createMockFile("resume.pdf", "application/pdf");
        (parseCV as jest.Mock).mockResolvedValue(mockCVText);
        (extractDetails as jest.Mock).mockResolvedValue(mockParsedCV);
        (calculateMatchScores as jest.Mock).mockRejectedValue(
            new Error("Matching failed"),
        );

        // Call the function
        const results = await processCVs([mockFile], "openai");

        // Verify error handling
        expect(results).toHaveLength(1);
        expect(results[0].candidate).toHaveLength(0);
        expect(results[0].error).toBe(
            "Failed to process CV resume.pdf: Matching failed",
        );
    });

    it("should process multiple CVs", async () => {
        // Setup mocks
        const mockFile1 = createMockFile("resume1.pdf", "application/pdf");
        const mockFile2 = createMockFile("resume2.pdf", "application/pdf");
        (parseCV as jest.Mock).mockResolvedValue(mockCVText);
        (extractDetails as jest.Mock).mockResolvedValue(mockParsedCV);
        (calculateMatchScores as jest.Mock).mockResolvedValue(
            mockAnalysisResult,
        );

        // Call the function
        const results = await processCVs([mockFile1, mockFile2], "openai");

        // Verify the results structure
        expect(results).toHaveLength(2);
        expect(parseCV).toHaveBeenCalledTimes(2);
        expect(extractDetails).toHaveBeenCalledTimes(2);
        expect(calculateMatchScores).toHaveBeenCalledTimes(4); // 2 files * 2 job roles
    });

    it("should handle mixed success and failure when processing multiple CVs", async () => {
        // Setup mocks
        const mockFile1 = createMockFile("resume1.pdf", "application/pdf");
        const mockFile2 = createMockFile("resume2.pdf", "application/pdf");

        // First file succeeds, second file fails
        // We need to ensure parseCV is called in the expected order
        (parseCV as jest.Mock).mockImplementation((file) => {
            if (file.name === "resume1.pdf") {
                return Promise.resolve(mockCVText);
            } else {
                return Promise.reject(new Error("PDF parsing failed"));
            }
        });

        (extractDetails as jest.Mock).mockResolvedValue(mockParsedCV);
        (calculateMatchScores as jest.Mock).mockResolvedValue(
            mockAnalysisResult,
        );

        // Call the function
        const results = await processCVs([mockFile1, mockFile2], "openai");

        // Verify the results structure
        expect(results).toHaveLength(2);

        // Find the successful result and the error result
        const successResult = results.find((r) => r.error === undefined);
        const errorResult = results.find((r) => r.error !== undefined);

        // Verify successful result
        expect(successResult).toBeDefined();
        expect(successResult?.candidate).toHaveLength(1);
        expect(successResult?.candidate[0].candidateDetails).toEqual(
            mockParsedCV,
        );

        // Verify error result
        expect(errorResult).toBeDefined();
        expect(errorResult?.candidate).toHaveLength(0);
        expect(errorResult?.error).toBe(
            "Failed to process CV resume2.pdf: PDF parsing failed",
        );
    });

    it("should throw an error if the overall process fails", async () => {
        // Setup a mock that will cause the overall process to fail
        const originalJobRoles = jobRolesData.jobRoles;
        Object.defineProperty(jobRolesData, "jobRoles", {
            get: jest.fn().mockImplementation(() => {
                throw new Error("Failed to load job roles");
            }),
        });

        // Call the function and expect it to throw
        await expect(processCVs([], "openai")).rejects.toThrow(
            "Failed to process CVs: Failed to load job roles",
        );

        // Restore the original property
        Object.defineProperty(jobRolesData, "jobRoles", {
            value: originalJobRoles,
            configurable: true,
        });
    });
});
