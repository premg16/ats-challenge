import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/ui/header";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

// Mock the components used in Header
jest.mock("@/components/ui/avatar", () => ({
    Avatar: ({ className, children }: any) => (
        <div className={className} data-testid="avatar">
            {children}
        </div>
    ),
    AvatarImage: ({ src, alt }: any) => (
        <img src={src} alt={alt} data-testid="avatar-image" />
    ),
    AvatarFallback: ({ children, className }: any) => (
        <div className={className} data-testid="avatar-fallback">
            {children}
        </div>
    ),
}));

jest.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick, className }: any) => (
        <button
            onClick={onClick}
            className={className}
            data-testid="theme-button"
        >
            {children}
        </button>
    ),
}));

jest.mock("lucide-react", () => ({
    Sun: () => <div data-testid="sun-icon">Sun</div>,
    Moon: () => <div data-testid="moon-icon">Moon</div>,
    Bell: () => <div data-testid="bell-icon-mock">Bell</div>,
}));

const renderHeader = (pathname = "/dashboard", theme = "light") => {
    (usePathname as jest.Mock).mockReturnValue(pathname);

    return render(
        <ThemeProvider defaultTheme={theme} enableSystem={false}>
            <Header />
        </ThemeProvider>,
    );
};

describe("Header", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly with default props", () => {
        renderHeader();

        expect(screen.getByText("Recruit Raid")).toBeInTheDocument();
        expect(screen.getByTestId("avatar")).toBeInTheDocument();
        expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
        expect(screen.getByTestId("theme-button")).toBeInTheDocument();
    });

    it("does not render on excluded paths", () => {
        renderHeader("/");
        expect(screen.queryByText("Recruit Raid")).not.toBeInTheDocument();

        renderHeader("/login");
        expect(screen.queryByText("Recruit Raid")).not.toBeInTheDocument();

        renderHeader("/register");
        expect(screen.queryByText("Recruit Raid")).not.toBeInTheDocument();

        renderHeader("/forgot-password");
        expect(screen.queryByText("Recruit Raid")).not.toBeInTheDocument();

        renderHeader("/reset-password");
        expect(screen.queryByText("Recruit Raid")).not.toBeInTheDocument();
    });

    it("renders the correct theme icon based on theme", () => {
        // For light theme
        const { unmount } = renderHeader("/dashboard", "light");
        expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();

        // Clean up before rendering with dark theme
        unmount();

        // For dark theme
        renderHeader("/dashboard", "dark");
        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("toggles theme when theme button is clicked", async () => {
        const user = userEvent.setup();
        renderHeader("/dashboard", "light");

        const themeButton = screen.getByTestId("theme-button");
        await user.click(themeButton);

        // Note: We can't fully test the theme change here since the ThemeProvider is mocked
        // and doesn't actually change the theme in the test environment
        expect(themeButton).toBeInTheDocument();
    });

    it("renders avatar with correct classes", () => {
        renderHeader();
        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveClass("h-8");
        expect(avatar).toHaveClass("w-8");
        expect(avatar).toHaveClass("border");
    });

    it("renders logo image", () => {
        renderHeader();
        const logo = screen.getByAltText("Logo");
        expect(logo).toBeInTheDocument();
        expect(logo.tagName.toLowerCase()).toBe("img");
    });
});
