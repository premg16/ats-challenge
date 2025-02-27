import { cn } from "@/lib/utils";

describe("cn utility function", () => {
    it("merges class names correctly", () => {
        expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("handles conditional classes", () => {
        const condition = true;
        expect(cn("base", condition && "conditional")).toBe("base conditional");
    });

    it("filters out falsy values", () => {
        expect(
            cn("base", false && "not-included", null, undefined, 0, ""),
        ).toBe("base");
    });

    it("handles object notation from clsx", () => {
        expect(
            cn("base", {
                "conditional-true": true,
                "conditional-false": false,
            }),
        ).toBe("base conditional-true");
    });

    it("handles array notation from clsx", () => {
        expect(cn("base", ["class1", "class2"])).toBe("base class1 class2");
    });

    it("handles nested arrays and objects", () => {
        expect(cn("base", ["class1", { nested: true }], { outer: true })).toBe(
            "base class1 nested outer",
        );
    });

    it("properly merges tailwind classes with tailwind-merge", () => {
        // tailwind-merge should merge conflicting classes, keeping the last one
        expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
        expect(cn("bg-red-500 text-white", "bg-blue-500")).toBe(
            "text-white bg-blue-500",
        );
    });

    it("handles complex tailwind class merging", () => {
        const result = cn(
            "flex items-center space-x-2 text-sm font-medium text-gray-500",
            "hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            "hover:text-gray-700",
        );

        // The hover:text-gray-700 should override hover:text-gray-900
        expect(result).toContain("hover:text-gray-700");
        expect(result).not.toContain("hover:text-gray-900");
    });
});
