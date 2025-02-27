import { useCandidateStore } from "@/lib/store/candidateStore";
import type { ProcessingResult } from "@/lib/types";

describe("CandidateStore", () => {
    // Reset the store state and clear localStorage before each test
    beforeEach(() => {
        localStorage.clear();
        // Reset the store state (this sets results back to an empty array)
        useCandidateStore.setState({ results: [] });
    });

    test("should have empty results initially", () => {
        const state = useCandidateStore.getState();
        expect(state.results).toEqual([]);
    });

    test("should update results via setResults", () => {
        const mockResults: ProcessingResult[] = [
            {
                candidate: [
                    {
                        candidateDetails: {
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
                                    jobTitle: "Frontend Developer",
                                    company: "Tech Co",
                                    location: "New York",
                                    duration: {
                                        startDate: "2020-01",
                                        endDate: "2023-01",
                                    },
                                    responsibilities: [
                                        "Developed UI components",
                                    ],
                                    achievements: [
                                        "Improved performance by 30%",
                                    ],
                                },
                            ],
                            education: [
                                {
                                    degree: "BS Computer Science",
                                    institution: "University of Technology",
                                    year: "2019",
                                },
                            ],
                            certifications: [
                                {
                                    name: "React Developer",
                                    issuer: "React Academy",
                                    year: "2021",
                                },
                            ],
                            additionalInfo: {
                                availability: "Immediate",
                                desiredSalary: "$100,000",
                                location: "Remote",
                            },
                        },
                        jobMatches: [
                            {
                                jobTitle: "Senior Frontend Developer",
                                analysis: {
                                    overallScore: 85,
                                    justification:
                                        "Strong match for technical skills",
                                    keyMatchingHighlights: [
                                        "React expertise",
                                        "Frontend development experience",
                                        "JavaScript proficiency",
                                    ],
                                    keyGaps: [
                                        "Limited leadership experience",
                                        "No TypeScript mentioned",
                                        "No backend experience",
                                    ],
                                    technicalSkillsMatch: {
                                        score: 90,
                                        matching: ["JavaScript", "React"],
                                        missing: ["TypeScript"],
                                    },
                                    softSkillsMatch: {
                                        score: 80,
                                        matching: ["Communication"],
                                        missing: ["Leadership"],
                                    },
                                    experienceMatch: {
                                        score: 85,
                                        matching:
                                            "3 years of frontend development",
                                        gaps: "No leadership roles",
                                    },
                                    educationMatch: {
                                        score: 90,
                                        matching:
                                            "Relevant degree in Computer Science",
                                        gaps: "No advanced degree",
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ];

        // Set the new results in the store
        useCandidateStore.getState().setResults(mockResults);
        const state = useCandidateStore.getState();
        expect(state.results).toEqual(mockResults);
    });

    test("should persist store results in localStorage", () => {
        const mockResults: ProcessingResult[] = [
            {
                candidate: [
                    {
                        candidateDetails: {
                            personalDetails: {
                                name: "Jane Smith",
                                contact: "987-654-3210",
                                email: "jane@example.com",
                                location: "San Francisco",
                                role: "Product Manager",
                            },
                            skills: {
                                technical: ["Product Development", "Agile"],
                                soft: ["Leadership", "Communication"],
                            },
                            experience: [
                                {
                                    jobTitle: "Associate Product Manager",
                                    company: "Product Inc",
                                    location: "San Francisco",
                                    duration: {
                                        startDate: "2019-06",
                                        endDate: "2022-06",
                                    },
                                    responsibilities: [
                                        "Managed product roadmap",
                                    ],
                                    achievements: [
                                        "Launched 5 successful features",
                                    ],
                                },
                            ],
                            education: [
                                {
                                    degree: "MBA",
                                    institution: "Business School",
                                    year: "2018",
                                },
                            ],
                            certifications: [
                                {
                                    name: "Certified Scrum Master",
                                    issuer: "Scrum Alliance",
                                    year: "2020",
                                },
                            ],
                            additionalInfo: {
                                availability: "2 weeks notice",
                                desiredSalary: "$120,000",
                                location: "Hybrid",
                            },
                        },
                        jobMatches: [],
                    },
                ],
            },
        ];

        // Update the store with mock results
        useCandidateStore.getState().setResults(mockResults);

        // The persist middleware uses the specified key in localStorage ("candidate-storage")
        const storedData = localStorage.getItem("candidate-storage");
        expect(storedData).toBeTruthy();

        // Parse the stored data and verify that the state was persisted correctly.
        const parsedData = JSON.parse(storedData as string);
        // The persisted data structure should include a "state" property with our store's state.
        expect(parsedData.state.results).toEqual(mockResults);
    });

    test("should handle error results correctly", () => {
        const errorResult: ProcessingResult = {
            candidate: [],
            error: "Failed to process candidate data",
        };

        useCandidateStore.getState().setResults([errorResult]);
        const state = useCandidateStore.getState();
        expect(state.results).toEqual([errorResult]);
        expect(state.results[0].error).toBe("Failed to process candidate data");
    });
});
