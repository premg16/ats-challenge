import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

describe('Card', () => {
  it('renders correctly with default props', () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toBeInTheDocument();
    expect(card.tagName.toLowerCase()).toBe('div');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
  });

  it('applies custom classes', () => {
    render(<Card className="custom-class">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('custom-class');
  });

  it('passes additional props to the div element', () => {
    render(<Card data-testid="test-card">Card Content</Card>);
    const card = screen.getByTestId('test-card');
    expect(card).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders correctly with default props', () => {
    render(<CardHeader>Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('p-6');
  });

  it('applies custom classes', () => {
    render(<CardHeader className="custom-class">Header Content</CardHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toHaveClass('custom-class');
  });
});

describe('CardTitle', () => {
  it('renders correctly with default props', () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('leading-none');
  });

  it('applies custom classes', () => {
    render(<CardTitle className="custom-class">Card Title</CardTitle>);
    const title = screen.getByText('Card Title');
    expect(title).toHaveClass('custom-class');
  });
});

describe('CardDescription', () => {
  it('renders correctly with default props', () => {
    render(<CardDescription>Card Description</CardDescription>);
    const description = screen.getByText('Card Description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm');
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('applies custom classes', () => {
    render(<CardDescription className="custom-class">Card Description</CardDescription>);
    const description = screen.getByText('Card Description');
    expect(description).toHaveClass('custom-class');
  });
});

describe('CardContent', () => {
  it('renders correctly with default props', () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });

  it('applies custom classes', () => {
    render(<CardContent className="custom-class">Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toHaveClass('custom-class');
  });
});

describe('CardFooter', () => {
  it('renders correctly with default props', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });

  it('applies custom classes', () => {
    render(<CardFooter className="custom-class">Footer Content</CardFooter>);
    const footer = screen.getByText('Footer Content');
    expect(footer).toHaveClass('custom-class');
  });
});

describe('Card composition', () => {
  it('renders a complete card with all components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Example Title</CardTitle>
          <CardDescription>Example Description</CardDescription>
        </CardHeader>
        <CardContent>Example Content</CardContent>
        <CardFooter>Example Footer</CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText('Example Description')).toBeInTheDocument();
    expect(screen.getByText('Example Content')).toBeInTheDocument();
    expect(screen.getByText('Example Footer')).toBeInTheDocument();
  });
});