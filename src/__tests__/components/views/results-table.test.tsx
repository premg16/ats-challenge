import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsTable } from '@/components/views/results-table';
import { useRouter } from 'next/navigation';
import { useCandidateStore } from '@/lib/store/candidateStore';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/store/candidateStore', () => ({
  useCandidateStore: jest.fn(),
}));

// Mock UI components
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table data-testid="table">{children}</table>,
  TableHeader: ({ children }: any) => <thead data-testid="table-header">{children}</thead>,
  TableBody: ({ children }: any) => <tbody data-testid="table-body">{children}</tbody>,
  TableHead: ({ children }: any) => <th data-testid="table-head">{children}</th>,
  TableRow: ({ children }: any) => <tr data-testid="table-row">{children}</tr>,
  TableCell: ({ children }: any) => <td data-testid="table-cell">{children}</td>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-testid="view-details-button"
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

describe('ResultsTable', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });
  
  const mockCandidateResult = {
    candidateDetails: {
      personalDetails: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '555-123-4567',
        location: 'New York',
        role: 'Software Engineer',
      },
    },
    jobMatches: [
      { jobTitle: 'Senior Developer', analysis: { overallScore: 85 } },
      { jobTitle: 'Frontend Engineer', analysis: { overallScore: 75 } },
      { jobTitle: 'Backend Developer', analysis: { overallScore: 65 } },
    ],
  };
  
  const mockResults = [{ candidate: [mockCandidateResult] }];
  
  const renderResultsTable = (results = mockResults) => {
    (useCandidateStore as unknown as jest.Mock).mockReturnValue({ results });
    return render(<ResultsTable />);
  };

  it('renders correctly with candidate data', () => {
    renderResultsTable();
    
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Candidate Name')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Top Matches')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('displays top job matches sorted by score', () => {
    renderResultsTable();
    
    const matches = screen.getAllByTestId('badge');
    expect(matches).toHaveLength(3); // Role badge + 2 top match score badges
    
    // Check that we're showing the top 2 matches
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Backend Developer')).not.toBeInTheDocument(); // This should not be shown
    
    // Check the scores are displayed
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('navigates to candidate details when View Details button is clicked', async () => {
    const user = userEvent.setup();
    renderResultsTable();
    
    const viewDetailsButton = screen.getByTestId('view-details-button');
    await user.click(viewDetailsButton);
    
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/candidate?name=')
    );
  });

  it('shows error message when no results are available', () => {
    (useCandidateStore as unknown as jest.Mock).mockReturnValue({ results: null });
    render(<ResultsTable />);
    
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.queryByTestId('table')).not.toBeInTheDocument();
  });

  it('renders empty table when results array is empty', () => {
    renderResultsTable([]);
    
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles candidates without email by showing contact info', () => {
    const candidateWithoutEmail = {
      ...mockCandidateResult,
      candidateDetails: {
        personalDetails: {
          name: 'Jane Smith',
          contact: '123-456-7890',
          email: '', // Adding empty email to satisfy the type requirement
          location: 'San Francisco',
          role: 'Product Manager',
        },
      },
    };
    
    renderResultsTable([{ candidate: [candidateWithoutEmail] }]);
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });
});