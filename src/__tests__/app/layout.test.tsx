import { render } from "@testing-library/react";
import "@testing-library/jest-dom";  // Updated import path
import RootLayout from "@/app/layout";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/views/header";

// Mock the components used in layout
jest.mock("@/components/ui/sonner", () => ({
    Toaster: jest
        .fn()
        .mockImplementation(({ richColors }) => (
            <div data-testid="mock-toaster">Mocked Toaster</div>
        )),
}));

jest.mock("@/components/theme-provider", () => ({
    ThemeProvider: jest
        .fn()
        .mockImplementation(
            ({ children, attribute, defaultTheme, enableSystem }) => (
                <div
                    data-testid="mock-theme-provider"
                    data-attribute={attribute}
                    data-default-theme={defaultTheme}
                    data-enable-system={enableSystem ? "true" : "false"}
                >
                    {children}
                </div>
            ),
        ),
}));

jest.mock("@/components/views/header", () => ({
    __esModule: true,
    default: jest
        .fn()
        .mockImplementation(() => (
            <div data-testid="mock-header">Mocked Header</div>
        )),
}));

// Mock next/font/google
jest.mock("next/font/google", () => ({
    Urbanist: jest.fn().mockReturnValue({
        className: "mocked-urbanist-class",
    }),
}));

// Mock React to handle html and body elements
jest.mock("react", () => {
    const actualReact = jest.requireActual("react");
    return {
        ...actualReact,
        createElement: function (type, props, ...children) {
            // For html and body elements, return a div instead to avoid nesting errors
            if (type === "html" || type === "body") {
                return actualReact.createElement(
                    "div",
                    {
                        ...props,
                        "data-testid": type,
                    },
                    ...children,
                );
            }
            return actualReact.createElement(type, props, ...children);
        },
    };
});

describe("RootLayout", () => {
    it("verifies that required components are imported", () => {
        // This test just verifies that the components are imported correctly
        expect(Toaster).toBeDefined();
        expect(ThemeProvider).toBeDefined();
        expect(Header).toBeDefined();
    });

    it("renders children within ThemeProvider", () => {
        const { getByTestId } = render(
            <RootLayout>
                <div data-testid="test-children">Test Children Content</div>
            </RootLayout>,
        );

        // Check that the mock components are rendered
        expect(getByTestId("mock-toaster")).toBeInTheDocument();
        expect(getByTestId("mock-theme-provider")).toBeInTheDocument();
        expect(getByTestId("mock-header")).toBeInTheDocument();

        // Check that children are rendered
        expect(getByTestId("test-children")).toBeInTheDocument();
        expect(getByTestId("test-children")).toHaveTextContent(
            "Test Children Content",
        );
    });

    it("passes correct props to ThemeProvider", () => {
        const { getByTestId } = render(
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>,
        );

        // Check that ThemeProvider is rendered with correct props
        const themeProvider = getByTestId("mock-theme-provider");
        expect(themeProvider).toBeInTheDocument();
        expect(themeProvider).toHaveAttribute("data-attribute", "class");
        expect(themeProvider).toHaveAttribute("data-default-theme", "system");
        expect(themeProvider).toHaveAttribute("data-enable-system", "true");
    });
});
