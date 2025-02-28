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
    Tabs: ({ children, defaultValue, onValueChange }: any) => (
        <div data-testid="tabs" data-default-value={defaultValue}>
            {children}
            {/* Call onValueChange when tabs are clicked to simulate tab switching */}
        </div>
    ),
    TabsList: ({ children }: any) => (
        <div data-testid="tabs-list">{children}</div>
    ),
    TabsTrigger: ({ children, value }: any) => (
        <button 
            data-testid={`tab-${value}`}
            onClick={() => document.dispatchEvent(new CustomEvent('tabChange', { detail: value }))}
        >
            {children}
        </button>
    ),
    TabsContent: ({ children, value }: any) => (
        <div data-testid={`tab-content-${value}`}>{children}</div>
    ),
}));

describe("CandidatePage", () => {
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
                    responsibilities: ["Led team of developers", "Architected solutions"],
                    achievements: ["Increased performance by 30%", "Reduced bugs by 50%"],
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
                    keyMatchingHighlights: ["Technical expertise", "Experience"],
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
        (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
        (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
        
        // Setup event listener for tab changes to simulate onValueChange
        document.addEventListener('tabChange', (e: any) => {
            // This simulates the onValueChange callback
            const tabsElement = document.querySelector('[data-testid="tabs"]');
            if (tabsElement) {
                tabsElement.setAttribute('data-active-tab', e.detail);
            }
        });
    });

    afterEach(() => {
        document.removeEventListener('tabChange', () => {});
    });

    it("should show/hide job selection dropdown based on active tab", () => {
        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidate] }],
        });
        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Initially (analysis tab), dropdown should be visible
        expect(screen.getByTestId("job-select")).toBeInTheDocument();

        // Switch to profile tab
        fireEvent.click(screen.getByTestId("tab-profile"));
        
        // Dropdown should be hidden
        expect(screen.queryByTestId("job-select")).not.toBeInTheDocument();

        // Switch back to analysis tab
        fireEvent.click(screen.getByTestId("tab-analysis"));
        
        // Dropdown should be visible again
        expect(screen.getByTestId("job-select")).toBeInTheDocument();
    });

    it("should update selected job when dropdown value changes", async () => {
        const mockCandidateWithMultipleJobs = {
            ...mockCandidate,
            jobMatches: [
                ...mockCandidate.jobMatches,
                {
                    jobTitle: "Full Stack Developer",
                    analysis: {
                        overallScore: 75,
                        // ... other analysis details
                    },
                },
            ],
        };

        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidateWithMultipleJobs] }],
        });
        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Initial job should be displayed
        expect(screen.getByText("Job Title: Senior Software Engineer")).toBeInTheDocument();

        // Select new job from dropdown
        const select = screen.getByTestId("job-select");
        fireEvent.click(select);
        
        const newJobOption = screen.getByTestId("job-option-1");
        fireEvent.click(newJobOption);

        // New job should be displayed
        expect(screen.getByText("Job Title: Full Stack Developer")).toBeInTheDocument();
        expect(screen.getByText("Score: 75%")).toBeInTheDocument();
    });

    it("should maintain selected job when switching between tabs", () => {
        const mockCandidateWithMultipleJobs = {
            ...mockCandidate,
            jobMatches: [
                ...mockCandidate.jobMatches,
                {
                    jobTitle: "Full Stack Developer",
                    analysis: {
                        overallScore: 75,
                    },
                },
            ],
        };

        (useCandidateStore as unknown as jest.Mock).mockReturnValue({
            results: [{ candidate: [mockCandidateWithMultipleJobs] }],
        });
        mockGet.mockReturnValue('"John Doe"');

        render(<CandidatePage />);

        // Select second job
        const select = screen.getByTestId("job-select");
        fireEvent.click(select);
        fireEvent.click(screen.getByTestId("job-option-1"));

        // Switch to profile tab
        fireEvent.click(screen.getByTestId("tab-profile"));
        
        // Switch back to analysis tab
        fireEvent.click(screen.getByTestId("tab-analysis"));

        // Selected job should still be displayed
        expect(screen.getByText("Job Title: Full Stack Developer")).toBeInTheDocument();
        expect(screen.getByText("Score: 75%")).toBeInTheDocument();
    });
});
