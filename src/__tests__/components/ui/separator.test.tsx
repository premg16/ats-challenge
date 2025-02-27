import { render } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renders correctly with default props (horizontal orientation)', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('h-[1px]');
    expect(separator).toHaveClass('w-full');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders with vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('h-full');
    expect(separator).toHaveClass('w-[1px]');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('applies custom classes', () => {
    const { container } = render(<Separator className="custom-class" />);
    const separator = container.firstChild as HTMLElement;
    
    expect(separator).toHaveClass('custom-class');
    expect(separator).toHaveClass('bg-border'); // Still has default classes
  });

  it('sets non-decorative role when decorative is false', () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = container.firstChild as HTMLElement;
    
    expect(separator).not.toHaveAttribute('aria-hidden', 'true');
    // When not decorative, it should have a separator role
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('combines orientation and custom classes correctly', () => {
    const { container } = render(
      <Separator orientation="vertical" className="my-custom-separator" />
    );
    const separator = container.firstChild as HTMLElement;
    
    expect(separator).toHaveClass('my-custom-separator');
    expect(separator).toHaveClass('h-full');
    expect(separator).toHaveClass('w-[1px]');
  });
});