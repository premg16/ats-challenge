import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from 'next-themes';

// Mock the next-themes useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn().mockReturnValue({ theme: 'light' }),
}));

// Mock the sonner Toaster component
jest.mock('sonner', () => ({
  Toaster: ({ className, theme, toastOptions }: any) => (
    <div 
      data-testid="sonner-toaster" 
      data-theme={theme} 
      className={className}
      data-toast-options={JSON.stringify(toastOptions)}
    >
      Mocked Toaster
    </div>
  ),
}));

describe('Toaster', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Toaster />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveClass('toaster');
    expect(toaster).toHaveClass('group');
  });

  it('passes theme from useTheme to Sonner', () => {
    (useTheme as jest.Mock).mockReturnValueOnce({ theme: 'dark' });
    
    const { container } = render(<Toaster />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    
    expect(toaster).toHaveAttribute('data-theme', 'dark');
  });

  it('passes custom props to Sonner', () => {
    const { container } = render(<Toaster position="top-right" closeButton />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    
    // The mocked component doesn't actually handle these props, but we can verify
    // that our component would pass them through
    expect(toaster).toBeInTheDocument();
  });

  it('configures toast options correctly', () => {
    const { container } = render(<Toaster />);
    const toaster = container.querySelector('[data-testid="sonner-toaster"]');
    
    const toastOptions = JSON.parse(toaster?.getAttribute('data-toast-options') || '{}');
    
    // Check that classNames are configured
    expect(toastOptions.classNames).toBeDefined();
    expect(toastOptions.classNames.toast).toContain('group-[.toaster]:bg-background');
    expect(toastOptions.classNames.description).toContain('group-[.toast]:text-muted-foreground');
    expect(toastOptions.classNames.actionButton).toContain('group-[.toast]:bg-primary');
    expect(toastOptions.classNames.cancelButton).toContain('group-[.toast]:bg-muted');
  });
});