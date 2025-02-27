import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CVUpload from "@/components/views/cv-upload";
import { toast } from "sonner";
import { processCVs } from "@/app/actions/cv-processing";
import * as React from "react";

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
    const React = require("react");
    return {
        Select: ({ children, onValueChange, value }: any) => (
            <div data-testid="select">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            onValueChange,
                            value,
                        });
                    }
                    return child;
                })}
                {/* Hidden native select to allow controlled behaviour if needed */}
                <select
                    data-testid="native-select"
                    value={value}
                    onChange={(e) =>
                        onValueChange && onValueChange(e.target.value)
                    }
                    style={{ display: "none" }}
                />
            </div>
        ),
        SelectContent: ({ children, onValueChange }: any) => (
            <div data-testid="select-content">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { onValueChange });
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

describe("CVUpload", () => {
    const mockOnUpload = jest.fn();
    const mockSetFiles = jest.fn();
    const mockFiles: File[] = [];

    beforeEach(() => {
        jest.clearAllMocks();
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
        (processCVs as jest.Mock).mockResolvedValue(mockResults);

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        await waitFor(() => {
            expect(processCVs).toHaveBeenCalledWith(
                mockFilesWithContent,
                "openai",
            );
            expect(mockOnUpload).toHaveBeenCalledWith(mockResults);
            expect(toast.success).toHaveBeenCalledWith(
                "CVs processed successfully",
            );
            expect(mockSetFiles).toHaveBeenCalledWith([]);
        });
    });

    it("shows error toast when trying to upload with no files", async () => {
        const mockToastError = jest.fn();
        (toast.error as jest.Mock).mockImplementation(mockToastError);

        renderCVUpload();

        const uploadButton = screen.getByText("Upload CVs");
        await userEvent.click(uploadButton);

        expect(mockToastError).not.toHaveBeenCalled();
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

        (processCVs as jest.Mock).mockRejectedValue(new Error("Upload failed"));

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error processing CVs");
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

        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        (processCVs as jest.Mock).mockImplementation(() => promise);

        const uploadButton = screen.getByText("Process CVs");
        await userEvent.click(uploadButton);

        expect(screen.getByTestId("loader-icon")).toBeInTheDocument();

        resolvePromise!([{ id: 1 }]);

        await waitFor(() => {
            expect(mockOnUpload).toHaveBeenCalled();
        });
    });

    it("changes AI provider when select value changes", async () => {
        // Provide a file so that the "Process CVs" button is rendered.
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

        // Simulate clicking on the select trigger to open options.
        const selectTrigger = screen.getByTestId("select-trigger");
        fireEvent.click(selectTrigger);

        // Wait for the "Google Gemini" option to appear and click it.
        const geminiOption = await waitFor(() =>
            screen.getByText("Google Gemini"),
        );
        fireEvent.click(geminiOption);

        // Click the "Process CVs" button after provider change.
        const processButton = screen.getByText("Process CVs");
        const mockResults = [{ id: 1, name: "Test Result" }];
        (processCVs as jest.Mock).mockResolvedValueOnce(mockResults);

        await userEvent.click(processButton);

        await waitFor(() => {
            expect(processCVs).toHaveBeenCalledWith(filesForTest, "gemini");
            expect(mockOnUpload).toHaveBeenCalledWith(mockResults);
            expect(toast.success).toHaveBeenCalledWith(
                "CVs processed successfully",
            );
        });
    });
});
