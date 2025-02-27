import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CandidatePage from "@/app/candidate/page";
import { useSearchParams, useRouter } from "next/navigation";
import { useCandidateStore } from "@/lib/store/candidateStore";

// Mock the Next.js navigation hooks
jest.mock("next/navigation", () => ({
    useSearchParams: jest.fn(),
    useRouter: jest.fn(),
}));

// Mock the candidate store
jest.mock("@/lib/store/candidateStore", () => ({
    useCandidateStore: jest.fn(),
}));

// Mock the JobMatchCard component
jest.mock("@/components/job-match-card", () => ({
    JobMatchCard: ({ match }: any) => (
        <div data-testid="job-match-card">
            <div>Job Title: {match.jobTitle}</div>
            <div>Score: {match.analysis.overallScore}%</div>
        </div>
    ),
}));

// Mock UI components to simplify testing
jest.mock("@/components/ui/tabs", () => ({
    Tabs: ({ children, defaultValue }: any) => (
        <div data-testid="tabs" data-default-value={defaultValue}>
            {children}
        </div>
    ),
    TabsList: ({ children }: any) => (
        <div data-testid="tabs-list">{children}</div>
    ),
    TabsTrigger: ({ children, value }: any) => (
        <button data-testid={`tab-${value}`}>{children}</button>
    ),
    TabsContent: ({ children, value }: any) => (
        <div data-testid={`tab-content-${value}`}>{children}</div>
    ),
}));

describe("CandidatePage", () => {
    // Mock data for testing
    const mockCandidate = {
        candidateDetails: {
            personalDetails: {
                name: "John Doe",
                role: "Software Engineer",
                email: "john@example.com",
                contact: "123-456-7890",
                location: "New York, USA",
            },
            skills: {
                technical: ["JavaScript", "React", "Node.js"],
                soft: ["Communication", "Leadership", "Problem Solving"],
            },
            experience: [
                {
                    jobTitle: "Senior Developer",
                    company: "Tech Corp",
                    location: "San Francisco",
                    duration: { startDate: "Jan 2020", endDate: "Present" },
                    responsibilities: [
                        "Led team of developers",
                        "Architected solutions",
                    ],
                    achievements: [
                        "Increased performance by 30%",
                        "Reduced bugs by 50%",
                    ],
                },
            ],
            education: [
                {
                    degree: "Bachelor of Science in Computer Science",
                    institution: "MIT",
                    year: "2015",
                },
            ],
            certifications: [
                {
                    name: "AWS Certified Developer",
                    issuer: "Amazon Web Services",
                    year: "2021",
                },
            ],
        },
        jobMatches: [
            {
                jobTitle: "Senior Software Engineer",
                analysis: {
                    overallScore: 85,
                    justification: "Strong technical match",
                    keyMatchingHighlights: [
                        "Technical expertise",
                        "Experience",
                    ],
                    keyGaps: ["Leadership experience"],
                    technicalSkillsMatch: {
                        score: 90,
                        matching: ["JavaScript", "React"],
                        missing: ["Python"],
                    },
                    softSkillsMatch: {
                        score: 80,
                        matching: ["Communication"],
                        missing: ["Mentoring"],
                    },
                    experienceMatch: {
                        score: 85,
                        matching: "Relevant experience in software development",
                    },
                    educationMatch: {
                        score: 100,
                        matching: "Meets educational requirements",
                    },
                },
            },
        ],
    };

    const mockBack = jest.fn();
    const mockGet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup router mock
        (useRouter as jest.Mock).mockReturnValue({
            back: mockBack,
        });

        // Setup search params mock
        (useSearchParams as jest.Mock).mockReturnValue({
            get: mockGet,
        });
    });

    it("renders candidate not found when candidate is null", () => {
        // Setup candidate store mock to return empty results
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        expect(screen.getByText("Candidate not found")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
    });

    it("renders candidate profile when candidate is found", () => {
        // Setup candidate store mock to return a candidate
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Check if candidate name is displayed
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Software Engineer")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("123-456-7890")).toBeInTheDocument();
        expect(screen.getByText("New York, USA")).toBeInTheDocument();

        // Check if tabs are rendered
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
        expect(screen.getByTestId("tab-analysis")).toBeInTheDocument();
        expect(screen.getByTestId("tab-profile")).toBeInTheDocument();

        // Check if job match card is rendered in analysis tab
        expect(screen.getByTestId("tab-content-analysis")).toBeInTheDocument();
        expect(screen.getByTestId("job-match-card")).toBeInTheDocument();
        expect(
            screen.getByText("Job Title: Senior Software Engineer"),
        ).toBeInTheDocument();
        expect(screen.getByText("Score: 85%")).toBeInTheDocument();
    });

    it("renders skills section in profile tab", () => {
        // Setup candidate store mock to return a candidate
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Check if skills section is rendered in profile tab
        expect(screen.getByTestId("tab-content-profile")).toBeInTheDocument();
        expect(screen.getByText("Skills")).toBeInTheDocument();
        expect(screen.getByText("Technical Skills")).toBeInTheDocument();
        expect(screen.getByText("Soft Skills")).toBeInTheDocument();

        // Check if technical skills are rendered
        expect(screen.getByText("JavaScript")).toBeInTheDocument();
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Node.js")).toBeInTheDocument();

        // Check if soft skills are rendered
        expect(screen.getByText("Communication")).toBeInTheDocument();
        expect(screen.getByText("Leadership")).toBeInTheDocument();
        expect(screen.getByText("Problem Solving")).toBeInTheDocument();
    });

    it("renders experience section in profile tab", () => {
        // Setup candidate store mock to return a candidate
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Check if experience section is rendered in profile tab
        expect(screen.getByText("Experience")).toBeInTheDocument();
        expect(screen.getByText("Senior Developer")).toBeInTheDocument();
        expect(
            screen.getByText("Tech Corp • San Francisco"),
        ).toBeInTheDocument();
        expect(screen.getByText("Jan 2020 - Present")).toBeInTheDocument();

        // Check if responsibilities and achievements are rendered
        expect(screen.getByText("Key Responsibilities")).toBeInTheDocument();
        expect(screen.getByText("Led team of developers")).toBeInTheDocument();
        expect(screen.getByText("Architected solutions")).toBeInTheDocument();

        expect(screen.getByText("Achievements")).toBeInTheDocument();
        expect(
            screen.getByText("Increased performance by 30%"),
        ).toBeInTheDocument();
        expect(screen.getByText("Reduced bugs by 50%")).toBeInTheDocument();
    });

    it("renders education and certifications sections in profile tab", () => {
        // Setup candidate store mock to return a candidate
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Check if education section is rendered
        expect(screen.getByText("Education")).toBeInTheDocument();
        expect(
            screen.getByText("Bachelor of Science in Computer Science"),
        ).toBeInTheDocument();
        expect(screen.getByText("MIT")).toBeInTheDocument();
        expect(screen.getByText("2015")).toBeInTheDocument();

        // Check if certifications section is rendered
        expect(screen.getByText("Certifications")).toBeInTheDocument();
        expect(screen.getByText("AWS Certified Developer")).toBeInTheDocument();
        expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
        expect(screen.getByText("2021")).toBeInTheDocument();
    });

    it("calls router.back when back button is clicked", async () => {
        // Setup candidate store mock to return a candidate
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });

        mockGet.mockReturnValue('"John Doe"');

        const user = userEvent.setup();
        render(<CandidatePage />);

        // Click the back button
        const backButton = screen.getByText("Back");
        await user.click(backButton);

        // Check if router.back was called
        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("handles candidate not found when results array is empty", () => {
        // Setup candidate store mock to return empty results
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        expect(screen.getByText("Candidate not found")).toBeInTheDocument();
    });

    it("handles candidate not found when name does not match any candidate", () => {
        // Setup candidate store mock to return a candidate with different name
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [
                {
                    candidate: [
                        {
                            ...mockCandidate,
                            candidateDetails: {
                                ...mockCandidate.candidateDetails,
                                personalDetails: {
                                    ...mockCandidate.candidateDetails
                                        .personalDetails,
                                    name: "Jane Smith",
                                },
                            },
                        },
                    ],
                },
            ],
        });

        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        expect(screen.getByText("Candidate not found")).toBeInTheDocument();
    });
});
