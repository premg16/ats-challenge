import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
    it("renders correctly with default props", () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText("Default Badge");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-primary");
    });

    it("renders with secondary variant", () => {
        render(<Badge variant="secondary">Secondary Badge</Badge>);
        const badge = screen.getByText("Secondary Badge");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-secondary");
    });

    it("renders with outline variant", () => {
        render(<Badge variant="outline">Outline Badge</Badge>);
        const badge = screen.getByText("Outline Badge");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("border");
    });

    it("renders with destructive variant", () => {
        render(<Badge variant="destructive">Destructive Badge</Badge>);
        const badge = screen.getByText("Destructive Badge");
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-destructive");
    });

    it("applies custom classes", () => {
        render(<Badge className="custom-class">Custom Badge</Badge>);
        const badge = screen.getByText("Custom Badge");
        expect(badge).toHaveClass("custom-class");
    });

    it("renders as a different element when asChild is true", () => {
        render(
            <Badge asChild>
                <a href="#">Link Badge</a>
            </Badge>,
        );
        const link = screen.getByRole("link", { name: /link badge/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "#");
    });

    it("combines variant and custom classes correctly", () => {
        render(
            <Badge variant="secondary" className="rounded-full">
                Rounded Badge
            </Badge>,
        );
        const badge = screen.getByText("Rounded Badge");
        expect(badge).toHaveClass("bg-secondary");
        expect(badge).toHaveClass("rounded-full");
    });
});
