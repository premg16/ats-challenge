import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { forwardRef } from 'react';


// Mock the Radix UI components
jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="select-root" {...props}>{children}</div>,
  Trigger: forwardRef(({ children, ...props }: any, ref: any) => (
    <button ref={ref} data-testid="select-trigger" {...props}>{children}</button>
  )),
  Value: ({ children, ...props }: any) => <span data-testid="select-value" {...props}>{children}</span>,
  Icon: ({ children, ...props }: any) => <span data-testid="select-icon" {...props}>{children}</span>,
  Portal: ({ children, ...props }: any) => <div data-testid="select-portal" {...props}>{children}</div>,
  Content: forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-content" {...props}>{children}</div>
  )),
  Viewport: ({ children, ...props }: any) => <div data-testid="select-viewport" {...props}>{children}</div>,
  Item: forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-item" {...props}>{children}</div>
  )),
  ItemText: ({ children, ...props }: any) => <span data-testid="select-item-text" {...props}>{children}</span>,
  ItemIndicator: ({ children, ...props }: any) => <span data-testid="select-item-indicator" {...props}>{children}</span>,
  Group: ({ children, ...props }: any) => <div data-testid="select-group" {...props}>{children}</div>,
  Label: forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-label" {...props}>{children}</div>
  )),
  Separator: forwardRef(({ ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-separator" {...props} />
  )),
  ScrollUpButton: forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-scroll-up" {...props}>{children}</div>
  )),
  ScrollDownButton: forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} data-testid="select-scroll-down" {...props}>{children}</div>
  )),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon">Check</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
}));

describe('Select components', () => {
  describe('SelectTrigger', () => {
    it('renders correctly with default props', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toBeInTheDocument();
    });

    it('applies custom classes', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger-class">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveAttribute('class', expect.stringContaining('custom-trigger-class'));
    });

    it('renders children correctly', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue>Test Value</SelectValue>
          </SelectTrigger>
        </Select>
      );
      
      const value = screen.getByTestId('select-value');
      expect(value).toBeInTheDocument();
      expect(value).toHaveTextContent('Test Value');
    });
  });

  describe('SelectContent', () => {
    it('renders correctly with default props', () => {
      render(
        <Select open>
          <SelectContent>
            <div>Content</div>
          </SelectContent>
        </Select>
      );
      
      const content = screen.getByTestId('select-content');
      expect(content).toBeInTheDocument();
    });

    it('applies custom classes', () => {
      render(
        <Select open>
          <SelectContent className="custom-content-class">
            <div>Content</div>
          </SelectContent>
        </Select>
      );
      
      const content = screen.getByTestId('select-content');
      expect(content).toHaveAttribute('class', expect.stringContaining('custom-content-class'));
    });

    it('renders children correctly', () => {
      render(
        <Select open>
          <SelectContent>
            <div data-testid="test-child">Test Child</div>
          </SelectContent>
        </Select>
      );
      
      const child = screen.getByTestId('test-child');
      expect(child).toBeInTheDocument();
      expect(child).toHaveTextContent('Test Child');
    });
  });

  describe('SelectItem', () => {
    it('renders correctly with default props', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const item = screen.getByTestId('select-item');
      expect(item).toBeInTheDocument();
    });

    it('applies custom classes', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectItem value="test" className="custom-item-class">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const item = screen.getByTestId('select-item');
      expect(item).toHaveAttribute('class', expect.stringContaining('custom-item-class'));
    });

    it('renders children correctly', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectItem value="test">Test Item Text</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const itemText = screen.getByTestId('select-item-text');
      expect(itemText).toBeInTheDocument();
      expect(itemText).toHaveTextContent('Test Item Text');
    });
  });

  describe('SelectGroup and SelectLabel', () => {
    it('renders correctly with default props', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group Label</SelectLabel>
              <SelectItem value="test">Test Item</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
      const group = screen.getByTestId('select-group');
      const label = screen.getByTestId('select-label');
      expect(group).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Group Label');
    });

    it('applies custom classes to SelectLabel', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="custom-label-class">Group Label</SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
      
      const label = screen.getByTestId('select-label');
      expect(label).toHaveAttribute('class', expect.stringContaining('custom-label-class'));
    });
  });

  describe('SelectSeparator', () => {
    it('renders correctly with default props', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const separator = screen.getByTestId('select-separator');
      expect(separator).toBeInTheDocument();
    });

    it('applies custom classes', () => {
      render(
        <Select open>
          <SelectContent>
            <SelectSeparator className="custom-separator-class" />
          </SelectContent>
        </Select>
      );
      
      const separator = screen.getByTestId('select-separator');
      expect(separator).toHaveAttribute('class', expect.stringContaining('custom-separator-class'));
    });
  });
});