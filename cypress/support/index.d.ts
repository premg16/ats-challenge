/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    findByText(text: string | RegExp): Chainable<Element>;
    findByLabelText(text: string | RegExp): Chainable<Element>;
    findByPlaceholderText(text: string | RegExp): Chainable<Element>;
    findByTestId(text: string | RegExp): Chainable<Element>;
    findByRole(text: string | RegExp): Chainable<Element>;
  }
}

interface Window {
  toast: {
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
  };
}

declare namespace Cypress {
    interface Window {
        toast: {
            error: (message: string) => void;
            success: (message: string) => void;
            info: (message: string) => void;
        };
    }
}