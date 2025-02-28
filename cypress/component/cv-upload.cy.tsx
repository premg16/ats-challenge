/// <reference types="cypress" />

import React from "react";
import CVUpload from "../../src/components/views/cv-upload";

describe("CVUpload Component", () => {
    let mockOnUpload: any;
    let mockSetFiles: any;

    beforeEach(() => {
        // Initialize stubs
        mockOnUpload = cy.stub().as("onUpload");
        mockSetFiles = cy.stub().as("setFiles");
        // Reset stubs
        mockOnUpload.reset();
        mockSetFiles.reset();

        // Mock toast functions on window
        cy.window().then((win) => {
            win.toast = {
                error: cy.stub().as("toastError"),
                success: cy.stub().as("toastSuccess"),
                info: cy.stub().as("toastInfo")
            };
        });

        // Mount component with default props
        cy.mount(
            <CVUpload
                onUpload={mockOnUpload}
                files={[]}
                setFiles={mockSetFiles}
            />
        );
    });

    it("renders upload button and AI provider selector", () => {
        cy.contains("button", "Upload CVs").should("be.visible");
        cy.get("[role=combobox]").should("be.visible");
    });

    it("allows AI provider selection", () => {
        // Open select dropdown
        cy.get("[role=combobox]").click();

        // Select Gemini option
        cy.contains("[role=option]", "Google Gemini").click();

        // Verify selection
        cy.get("[role=combobox]").should("contain", "Google Gemini");
    });

    it("handles valid file upload", () => {
        // Create a test file (a real File object)
        cy.fixture('example.json').then(fileContent => {
            const testFile = new File(
                [JSON.stringify(fileContent)],
                'test.pdf',
                { type: 'application/pdf' }
            );
            // Pass the file wrapped in an array with a type cast as a workaround.
            cy.get("input[type=file]").selectFile([testFile] as any, { force: true });

            // Verify setFiles was called
            cy.get("@setFiles").should("have.been.called");
        });
    });

    it("validates file types", () => {
        // Create an invalid file (jpg instead of pdf)
        cy.fixture('example.json').then(fileContent => {
            const invalidFile = new File(
                [JSON.stringify(fileContent)],
                'test.jpg',
                { type: 'image/jpeg' }
            );

            // Pass the file wrapped in an array with a type cast.
            cy.get("input[type=file]").selectFile([invalidFile] as any, { force: true });

            // Verify that the error toast is shown with the correct message
            cy.get("@toastError").should("have.been.calledWith",
                "test.jpg is not a supported file type"
            );
        });
    });

    it("handles file limit exceeded", () => {
        // Create test files (an array of 4 files) so that file limit is exceeded (limit is 3)
        cy.fixture('example.json').then(fileContent => {
            const files = Array(4)
                .fill(null)
                .map((_, i) => 
                    new File(
                        [JSON.stringify(fileContent)],
                        `test${i}.pdf`,
                        { type: 'application/pdf' }
                    )
                );

            // Pass the file array with a type cast.
            cy.get("input[type=file]").selectFile(files as any, { force: true });

            // Verify that the error toast is shown for exceeding the file limit
            cy.get("@toastError").should("have.been.calledWith",
                "You can upload a maximum of 3 files due to processing time constraints"
            );
        });
    });

    it("processes files successfully", () => {
        // Mock a successful API response
        cy.intercept("POST", "/api/cv-processing", {
            statusCode: 200,
            body: { results: [{ id: 1, name: "Test Result" }] }
        }).as("processCV");

        // Create and add a test file
        cy.fixture('example.json').then(fileContent => {
            const testFile = new File(
                [JSON.stringify(fileContent)],
                'test.pdf',
                { type: 'application/pdf' }
            );

            // Re‑mount component with a pre‑populated file
            cy.mount(
                <CVUpload
                    onUpload={mockOnUpload}
                    files={[testFile]}
                    setFiles={mockSetFiles}
                />
            );
            // Re‑assign the toast stubs after mounting
            cy.window().then((win) => {
                win.toast = {
                    error: cy.stub().as("toastError"),
                    success: cy.stub().as("toastSuccess"),
                    info: cy.stub().as("toastInfo")
                };
            });

            // Click the "Process CVs" button
            cy.contains("button", "Process CVs").click();

            // Wait for the API call to complete
            cy.wait("@processCV");

            // Verify the success toast and that onUpload was called
            cy.get("@toastSuccess").should("have.been.calledWith",
                "CVs processed successfully"
            );
            cy.get("@onUpload").should("have.been.called");
        });
    });

    it("handles processing errors", () => {
        // Mock a failed API response
        cy.intercept("POST", "/api/cv-processing", {
            statusCode: 500,
            body: { error: "Processing failed" }
        }).as("processCV");

        // Create and add a test file
        cy.fixture('example.json').then(fileContent => {
            const testFile = new File(
                [JSON.stringify(fileContent)],
                'test.pdf',
                { type: 'application/pdf' }
            );

            // Re‑mount component with a pre‑populated file
            cy.mount(
                <CVUpload
                    onUpload={mockOnUpload}
                    files={[testFile]}
                    setFiles={mockSetFiles}
                />
            );
            // Re‑assign toast stubs after mounting
            cy.window().then((win) => {
                win.toast = {
                    error: cy.stub().as("toastError"),
                    success: cy.stub().as("toastSuccess"),
                    info: cy.stub().as("toastInfo")
                };
            });

            // Click the "Process CVs" button
            cy.contains("button", "Process CVs").click();

            // Wait for the API call to complete
            cy.wait("@processCV");

            // Verify that the error toast is shown with the correct error message
            cy.get("@toastError").should("have.been.calledWith",
                "Error processing CVs: Processing failed"
            );
        });
    });

    it("shows loading state during processing", () => {
        // Mock a slow API response
        cy.intercept("POST", "/api/cv-processing", (req) => {
            req.reply({
                delay: 1000,
                statusCode: 200,
                body: { results: [{ id: 1 }] }
            });
        }).as("processCV");

        // Create and add a test file
        cy.fixture('example.json').then(fileContent => {
            const testFile = new File(
                [JSON.stringify(fileContent)],
                'test.pdf',
                { type: 'application/pdf' }
            );

            // Re‑mount component with a pre‑populated file
            cy.mount(
                <CVUpload
                    onUpload={mockOnUpload}
                    files={[testFile]}
                    setFiles={mockSetFiles}
                />
            );
            // Re‑assign toast stubs after mounting
            cy.window().then((win) => {
                win.toast = {
                    error: cy.stub().as("toastError"),
                    success: cy.stub().as("toastSuccess"),
                    info: cy.stub().as("toastInfo")
                };
            });

            // Click the "Process CVs" button
            cy.contains("button", "Process CVs").click();

            // Verify the loading indicator is visible
            cy.contains("Processing...").should("be.visible");
            cy.get("[class*='animate-spin']").should("be.visible");

            // Wait for the API call to complete
            cy.wait("@processCV");

            // Verify the loading state is removed
            cy.contains("Processing...").should("not.exist");
        });
    });
});