/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
    interface Matchers<R> {
        toBeInTheDocument(): R;
        toHaveClass(className: string): R;
        toHaveAttribute(attr: string, value?: string): R;
        toHaveTextContent(text: string | RegExp): R;
        toContainElement(element: HTMLElement | null): R;
        toHaveStyle(css: Record<string, any>): R;
    }
}
