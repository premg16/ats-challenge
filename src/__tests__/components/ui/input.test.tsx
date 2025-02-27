import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
    it("renders correctly with default props", () => {
        render(<Input />);
        const input = screen.getByRole("textbox");
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass("rounded-md");
        expect(input).toHaveClass("border");
    });

    it("applies custom classes", () => {
        render(<Input className="custom-class" />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveClass("custom-class");
    });

    it("renders with different input types", () => {
        render(<Input type="password" />);
        const input = document.querySelector('input[type="password"]');
        expect(input).toBeInTheDocument();
    });

    it("passes additional props to the input element", () => {
        render(<Input placeholder="Enter text" data-testid="test-input" />);
        const input = screen.getByTestId("test-input");
        expect(input).toHaveAttribute("placeholder", "Enter text");
    });

    it("handles disabled state correctly", () => {
        render(<Input disabled />);
        const input = screen.getByRole("textbox");
        expect(input).toBeDisabled();
        expect(input).toHaveClass("disabled:opacity-50");
    });

    it("accepts user input correctly", async () => {
        const user = userEvent.setup();
        render(<Input />);
        const input = screen.getByRole("textbox");

        await user.type(input, "Hello, world!");
        expect(input).toHaveValue("Hello, world!");
    });

    it("handles required attribute correctly", () => {
        render(<Input required />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("required");
    });

    it("handles readonly attribute correctly", () => {
        render(<Input readOnly />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("readonly");
    });
});
