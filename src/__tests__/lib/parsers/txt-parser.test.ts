import { parseTxt } from "@/lib/parsers/txt-parser";

describe("TXT Parser", () => {
    // Helper function to create a mock File with text method
    function createMockFile(content: string, name: string, type: string) {
        return {
            name,
            type,
            text: jest.fn().mockResolvedValue(content),
        } as unknown as File;
    }

    it("should parse text content correctly", async () => {
        // Create a mock File object with the text method
        const fileContent =
            "Sample text content\r\nWith different line endings\rMixed formats";
        const file = createMockFile(fileContent, "sample.txt", "text/plain");

        // Call the parser
        const result = await parseTxt(file);

        // Verify the result
        expect(result).toBe(
            "Sample text content\nWith different line endings\nMixed formats",
        );
    });

    it("should handle BOM characters", async () => {
        // Create a mock File with BOM
        const fileContent = "\uFEFFText with BOM character";
        const file = createMockFile(fileContent, "bom.txt", "text/plain");

        // Call the parser
        const result = await parseTxt(file);

        // Verify the result
        expect(result).toBe("Text with BOM character");
    });

    it("should throw an error for invalid files", async () => {
        // Mock a file that will cause an error
        const mockFile = {
            text: jest.fn().mockRejectedValue(new Error("Mock error")),
        } as unknown as File;

        // Expect the function to throw
        await expect(parseTxt(mockFile)).rejects.toThrow(
            "TXT parsing error: Mock error",
        );
    });

    it("should handle empty text files", async () => {
        // Create an empty file
        const file = createMockFile("", "empty.txt", "text/plain");

        // Call the parser
        const result = await parseTxt(file);

        // Verify the result
        expect(result).toBe("");
    });

    it("should handle files with only BOM character", async () => {
        // Create a file with only BOM
        const fileContent = "\uFEFF";
        const file = createMockFile(fileContent, "only-bom.txt", "text/plain");

        // Call the parser
        const result = await parseTxt(file);

        // Verify the result
        expect(result).toBe("");
    });

    it("should normalize mixed line endings consistently", async () => {
        // Create a file with mixed line endings
        const fileContent = "Line1\r\nLine2\rLine3\nLine4";
        const file = createMockFile(
            fileContent,
            "mixed-endings.txt",
            "text/plain",
        );

        // Call the parser
        const result = await parseTxt(file);

        // Verify all line endings are normalized
        expect(result).toBe("Line1\nLine2\nLine3\nLine4");
    });
});
