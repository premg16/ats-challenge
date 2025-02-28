import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

// Mock the components used in page
jest.mock("@/components/ui/button", () => ({
    Button: jest
        .fn()
        .mockImplementation(
            ({ children, size, variant, className, ...props }) => (
                <button
                    data-testid="mock-button"
                    data-size={size}
                    data-variant={variant}
                    className={className}
                    {...props}
                >
                    {children}
                </button>
            ),
        ),
}));

jest.mock("@/components/ui/card", () => ({
    Card: jest.fn().mockImplementation(({ children, className, ...props }) => (
        <div data-testid="mock-card" className={className} {...props}>
            {children}
        </div>
    )),
}));

jest.mock("next/link", () =>
    jest.fn().mockImplementation(({ href, children, ...props }) => (
        <a data-testid="mock-link" href={href} {...props}>
            {children}
        </a>
    )),
);

jest.mock("lucide-react", () => ({
    Upload: () => <div data-testid="mock-upload-icon">Upload Icon</div>,
    Brain: () => <div data-testid="mock-brain-icon">Brain Icon</div>,
    BarChart3: () => <div data-testid="mock-barchart-icon">BarChart Icon</div>,
}));

describe("Page", () => {
    it("renders the hero section correctly", () => {
        render(<Page />);

        // Check hero section content - using a function to find text within the h1 element
        const heroHeading = screen.getByText((content, element) => {
            return (
                element.tagName.toLowerCase() === "h1" &&
                content.includes("Transform Your") &&
                content.includes("Process")
            );
        });
        expect(heroHeading).toBeInTheDocument();

        // Check for the highlighted 'Hiring' text in a span
        expect(
            screen.getByText((content) => content.trim() === "Hiring"),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "AI-powered candidate ranking system that revolutionizes how you hire for blue-collar & sales roles.",
            ),
        ).toBeInTheDocument();

        // Check hero section buttons
        const getStartedButton = screen
            .getByText("Get Started")
            .closest('[data-testid="mock-button"]');
        expect(getStartedButton).toBeInTheDocument();
        expect(getStartedButton).toHaveAttribute("data-size", "lg");
        
        // Check that Get Started button has a link to dashboard
        const getStartedLink = screen.getByText("Get Started").closest('[data-testid="mock-link"]');
        expect(getStartedLink).toBeInTheDocument();
        expect(getStartedLink).toHaveAttribute("href", "/dashboard");

        const watchDemoButton = screen
            .getByText("Watch Demo")
            .closest('[data-testid="mock-button"]');
        expect(watchDemoButton).toBeInTheDocument();
        expect(watchDemoButton).toHaveAttribute("data-size", "lg");
        expect(watchDemoButton).toHaveAttribute("data-variant", "outline");
    });

    it("renders the features section correctly", () => {
        render(<Page />);

        // Check features section heading
        expect(screen.getByText("Powerful Features")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Everything you need to streamline your recruitment process",
            ),
        ).toBeInTheDocument();

        // Check feature cards
        const cards = screen.getAllByTestId("mock-card");
        expect(cards).toHaveLength(3);

        // Check feature titles
        expect(screen.getByText("Smart CV Upload")).toBeInTheDocument();
        expect(screen.getByText("AI Analysis")).toBeInTheDocument();
        expect(screen.getByText("Smart Ranking")).toBeInTheDocument();

        // Check feature descriptions
        expect(
            screen.getByText(
                "Bulk upload CVs in any format. Our AI handles the rest.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Advanced algorithms extract and analyze candidate information with high precision.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Get instant candidate rankings with detailed match scores.",
            ),
        ).toBeInTheDocument();

        // Check feature icons
        expect(screen.getByTestId("mock-upload-icon")).toBeInTheDocument();
        expect(screen.getByTestId("mock-brain-icon")).toBeInTheDocument();
        expect(screen.getByTestId("mock-barchart-icon")).toBeInTheDocument();
    });

    it("renders the CTA section correctly", () => {
        render(<Page />);

        // Check CTA section content
        expect(screen.getByText("Ready to Get Started?")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Join hundreds of companies already using Recruit Raid to find their perfect candidates.",
            ),
        ).toBeInTheDocument();

        // Check CTA button with link
        expect(screen.getByText("Try for Free")).toBeInTheDocument();
        const tryForFreeLink = screen.getByText("Try for Free").closest('[data-testid="mock-link"]');
        expect(tryForFreeLink).toHaveAttribute("href", "/dashboard");
    });

    it("has the correct main container classes", () => {
        const { container } = render(<Page />);
        const main = container.querySelector("main");

        expect(main).toHaveClass("max-h-svh");
        expect(main).toHaveClass("bg-gradient-to-br");
        expect(main).toHaveClass("overflow-y-auto");
    });
});
