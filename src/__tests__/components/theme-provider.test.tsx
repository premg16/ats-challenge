import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

// Mock the next-themes module
jest.mock("next-themes", () => ({
    useTheme: jest.fn(),
    ThemeProvider: ({ children, ...props }) => (
        <div data-testid="theme-provider">{children}</div>
    ),
}));

describe("ThemeProvider", () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Default mock implementation
        (useTheme as jest.Mock).mockReturnValue({
            theme: "light",
            setTheme: jest.fn(),
        });
    });

    it("renders without crashing", () => {
        const { getByTestId } = render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div>Test content</div>
            </ThemeProvider>,
        );

        expect(getByTestId("theme-provider")).toBeInTheDocument();
    });

    it("renders children correctly", () => {
        const { getByText } = render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div>Test content</div>
            </ThemeProvider>,
        );

        expect(getByText("Test content")).toBeInTheDocument();
    });

    it("passes props correctly to next-themes ThemeProvider", () => {
        const { ThemeProvider: NextThemeProvider } = require("next-themes");
        const spy = jest.spyOn(require("next-themes"), "ThemeProvider");

        render(
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                storageKey="custom-theme-key"
            >
                <div>Test content</div>
            </ThemeProvider>,
        );

        // Check that the spy was called
        expect(spy).toHaveBeenCalled();

        // Check that the first argument to the spy contains the expected props
        const callArgs = spy.mock.calls[0][0];
        expect(callArgs).toHaveProperty("attribute", "class");
        expect(callArgs).toHaveProperty("defaultTheme", "dark");
        expect(callArgs).toHaveProperty("enableSystem", false);
        expect(callArgs).toHaveProperty("storageKey", "custom-theme-key");
        expect(callArgs).toHaveProperty("children");
    });
});
