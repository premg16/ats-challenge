import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CVUpload from "@/components/views/cv-upload";
import { toast } from "sonner";
import { processCVs } from "@/app/actions/cv-processing";
import React from "react";

// Mock dependencies
jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("@/app/actions/cv-processing", () => ({
    processCVs: jest.fn(),
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
    Upload: () => <div data-testid="upload-icon">Upload</div>,
    Loader2: () => <div data-testid="loader-icon">Loading</div>,
    X: () => <div data-testid="x-icon">X</div>,
}));

// Updated mock for UI components including a more realistic Select behaviour
jest.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick, disabled, className }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
            data-testid="button"
        >
            {children}
        </button>
    ),
}));

jest.mock("@/components/ui/select", () => {
    return {
        Select: ({
            children,
            onValueChange,
            value,
        }: {
            children: React.ReactNode;
            onValueChange?: (value: string) => void;
            value?: string;
        }) => (
            <div data-testid="select">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(
                            child as React.ReactElement<any>,
                            {
                                onValueChange,
                                value,
                            },
                        );
                    }
                    return child;
                })}
                <select
                    data-testid="native-select"
                    value={value}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    style={{ display: "none" }}
                />
            </div>
        ),
        SelectContent: ({
            children,
            onValueChange,
        }: {
            children: React.ReactNode;
            onValueChange?: (value: string) => void;
        }) => (
            <div data-testid="select-content">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(
                            child as React.ReactElement<any>,
                            {
                                onValueChange,
                            },
                        );
                    }
                    return child;
                })}
            </div>
        ),
        SelectItem: ({ children, value, onValueChange }: any) => (
            <div
                data-testid="select-item"
                data-value={value}
                onClick={() => onValueChange && onValueChange(value)}
            >
                {children}
            </div>
        ),
        SelectTrigger: ({ children }: any) => (
            <div data-testid="select-trigger">{children}</div>
        ),
        SelectValue: ({ placeholder, value }: any) => (
            <div data-testid="select-value">{value || placeholder}</div>
        ),
    };
});

jest.mock("@/components/ui/input", () => ({
    Input: ({ type, onChange, className, multiple, accept }: any) => (
        <input
            type={type}
            onChange={onChange}
            className={className}
            multiple={multiple}
            accept={accept}
            data-testid="file-input"
        />
    ),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("CVUpload", () => {
    const mockOnUpload = jest.fn();
    const mockSetFiles = jest.fn();
    const mockFiles: File[] = [];

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockReset();
    });

    const renderCVUpload = () => {
        return render(
            <CVUpload
                onUpload={mockOnUpload}
                files={mockFiles}
                setFiles={mockSetFiles}
            />,
        );
    };

    it("renders correctly with default props", () => {
        renderCVUpload();

        expect(screen.getByText("Upload CVs")).toBeInTheDocument();
        expect(screen.getByTestId("upload-icon")).toBeInTheDocument();
        expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
        expect(screen.getByTestId("file-input")).toBeInTheDocument();
    });

    it("handles file selection through input", async () => {
        renderCVUpload();

        const file = new File(["test content"], "test.pdf", {
            type: "application/pdf",
        });
        const input = screen.getByTestId("file-input");

        await userEvent.upload(input, file);

        expect(mockSetFiles).toHaveBeenCalled();
    });

    it("validates file types and rejects invalid files", async () => {
        (toast.error as jest.Mock).mockClear();

        renderCVUpload();

        const invalidFile = new File(["test content"], "test.jpg", {
            type: "image/jpeg",
        });
        const input = screen.getByTestId("file-input");

        fireEvent.change(input, { target: { files: [invalidFile] } });

        expect(toast.error).toHaveBeenCalledWith(
            "test.jpg is not a supported file type",
        );
        expect(mockSetFiles).not.toHaveBeenCalled();
    });

    it("handles upload button click", async () => {
        const mockFilesWithContent = [
            new File(["test content"], "test.pdf", { type: "application/pdf" }),
        ];

        render(
            <CVUpload
                onUpload={mockOnUpload}
                files={mockFilesWithContent}
                setFiles={mockSetFiles}
            />,
        );

        const mockResults = [{ id: 1, name: "Test Result" }];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ results: mockResults }),
        });

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/cv-processing",
                expect.objectContaining({
                    method: "POST",
                    body: expect.any(FormData),
                })
            );
            expect(mockOnUpload).toHaveBeenCalledWith(mockResults);
            expect(toast.success).toHaveBeenCalledWith(
                "CVs processed successfully"
            );
            expect(mockSetFiles).toHaveBeenCalledWith([]);
        });
    });

    it("handles upload errors gracefully", async () => {
        const mockFilesWithContent = [
            new File(["test content"], "test.pdf", { type: "application/pdf" }),
        ];

        render(
            <CVUpload
                onUpload={mockOnUpload}
                files={mockFilesWithContent}
                setFiles={mockSetFiles}
            />,
        );

        const errorMessage = "Failed to process CVs";
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: errorMessage }),
        });

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                expect.stringContaining("Error processing CVs")
            );
        });
    });

    it("shows loading state during upload", async () => {
        const mockFilesWithContent = [
            new File(["test content"], "test.pdf", { type: "application/pdf" }),
        ];

        render(
            <CVUpload
                onUpload={mockOnUpload}
                files={mockFilesWithContent}
                setFiles={mockSetFiles}
            />,
        );

        let resolveResponse: (value: any) => void;
        const responsePromise = new Promise((resolve) => {
            resolveResponse = resolve;
        });

        (global.fetch as jest.Mock).mockImplementationOnce(() => responsePromise);

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        expect(screen.getByTestId("loader-icon")).toBeInTheDocument();

        resolveResponse!({
            ok: true,
            json: () => Promise.resolve({ results: [{ id: 1 }] }),
        });

        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalled();
        });
    });

    it("changes AI provider when select value changes", async () => {
        const fileForTest = new File(["dummy content"], "test.pdf", {
            type: "application/pdf",
        });
        const filesForTest = [fileForTest];

        render(
            <CVUpload
                onUpload={mockOnUpload}
                files={filesForTest}
                setFiles={mockSetFiles}
            />,
        );

        const selectTrigger = screen.getByTestId("select-trigger");
        fireEvent.click(selectTrigger);

        const geminiOption = await screen.findByText("Google Gemini");
        fireEvent.click(geminiOption);

        const processButton = screen.getByText("Process CVs");
        const mockResults = [{ id: 1, name: "Test Result" }];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ results: mockResults }),
        });

        await userEvent.click(processButton);

        await waitFor(() => {
            const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
            const formData = fetchCall[1].body as FormData;
            expect(formData.get("provider")).toBe("gemini");
            expect(mockOnUpload).toHaveBeenCalledWith(mockResults);
            expect(toast.success).toHaveBeenCalledWith(
                "CVs processed successfully"
            );
        });
    });
});
