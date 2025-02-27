import { render, screen } from '@testing-library/react';
import { JobMatchCard } from '@/components/job-match-card';

// Mock data for testing
const mockMatch = {
  jobTitle: 'Software Engineer',
  analysis: {
    overallScore: 85,
    justification: 'Strong technical skills match with relevant experience',
    keyMatchingHighlights: ['React expertise', 'TypeScript knowledge'],
    keyGaps: ['AWS certification'],
    technicalSkillsMatch: {
      score: 90,
      matching: ['React', 'TypeScript', 'Next.js'],
      missing: ['AWS', 'Docker']
    },
    softSkillsMatch: {
      score: 80,
      matching: ['Communication', 'Teamwork'],
      missing: ['Leadership']
    },
    experienceMatch: {
      score: 85,
      matching: '5 years of relevant experience',
      gaps: 'No experience with cloud platforms'
    },
    educationMatch: {
      score: 75,
      matching: 'Bachelor degree in Computer Science',
      gaps: 'No specialized certifications'
    }
  }
};

// Mock with empty arrays to test conditional rendering
const mockEmptyMatch = {
  jobTitle: 'Software Engineer',
  analysis: {
    overallScore: 50,
    justification: '',
    keyMatchingHighlights: [],
    keyGaps: [],
    technicalSkillsMatch: {
      score: 40,
      matching: [],
      missing: []
    },
    softSkillsMatch: {
      score: 30,
      matching: [],
      missing: []
    },
    experienceMatch: {
      score: 50,
      matching: '',
      gaps: undefined
    },
    educationMatch: {
      score: 60,
      matching: '',
      gaps: undefined
    }
  }
};

// Mock with medium scores to test color classes
const mockMediumMatch = {
  ...mockMatch,
  analysis: {
    ...mockMatch.analysis,
    overallScore: 65,
    technicalSkillsMatch: { ...mockMatch.analysis.technicalSkillsMatch, score: 65 },
    softSkillsMatch: { ...mockMatch.analysis.softSkillsMatch, score: 65 },
    experienceMatch: { ...mockMatch.analysis.experienceMatch, score: 65 },
    educationMatch: { ...mockMatch.analysis.educationMatch, score: 65 }
  }
};

// Mock with low scores to test color classes
const mockLowMatch = {
  ...mockMatch,
  analysis: {
    ...mockMatch.analysis,
    overallScore: 45,
    technicalSkillsMatch: { ...mockMatch.analysis.technicalSkillsMatch, score: 45 },
    softSkillsMatch: { ...mockMatch.analysis.softSkillsMatch, score: 45 },
    experienceMatch: { ...mockMatch.analysis.experienceMatch, score: 45 },
    educationMatch: { ...mockMatch.analysis.educationMatch, score: 45 }
  }
};

describe('JobMatchCard', () => {
  it('renders the job title correctly', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('displays the overall score correctly', () => {
    render(<JobMatchCard match={mockMatch} />);
    // Use a more specific query to find the 85% text in the overall score section
    expect(screen.getByText((content, element) => {
      return content.includes('85%') && 
             element.tagName.toLowerCase() === 'div' && 
             element.className.includes('text-4xl font-bold');
    })).toBeInTheDocument();
    expect(screen.getByText('Overall Match')).toBeInTheDocument();
  });

  it('renders the analysis summary when provided', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('Strong technical skills match with relevant experience')).toBeInTheDocument();
  });

  it('shows fallback text when analysis summary is empty', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No detailed analysis available.')).toBeInTheDocument();
  });

  it('displays key matching highlights when available', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('React expertise')).toBeInTheDocument();
    expect(screen.getByText('TypeScript knowledge')).toBeInTheDocument();
  });

  it('shows fallback text when no key highlights are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No key highlights identified.')).toBeInTheDocument();
  });

  it('displays key gaps when available', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('AWS certification')).toBeInTheDocument();
  });

  it('shows fallback text when no key gaps are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No significant gaps identified.')).toBeInTheDocument();
  });

  it('displays technical skills scores and matching skills', () => {
    render(<JobMatchCard match={mockMatch} />);
    // Use a more specific query to find the Technical Skills text in the score breakdown section
    expect(screen.getByText((content, element) => {
      return content === 'Technical Skills' && element.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('displays technical skills missing skills', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('shows fallback text when no matching technical skills are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No matching technical skills found.')).toBeInTheDocument();
  });

  it('shows fallback text when no missing technical skills are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No missing technical skills identified.')).toBeInTheDocument();
  });

  it('displays soft skills scores and matching skills', () => {
    render(<JobMatchCard match={mockMatch} />);
    // Use a more specific query to find the Soft Skills text in the score breakdown section
    expect(screen.getByText((content, element) => {
      return content === 'Soft Skills' && element.tagName.toLowerCase() === 'span';
    })).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Teamwork')).toBeInTheDocument();
  });

  it('displays soft skills missing skills', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });

  it('shows fallback text when no matching soft skills are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No matching soft skills found.')).toBeInTheDocument();
  });

  it('shows fallback text when no missing soft skills are available', () => {
    render(<JobMatchCard match={mockEmptyMatch} />);
    expect(screen.getByText('No missing soft skills identified.')).toBeInTheDocument();
  });

  it('displays experience match information', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('5 years of relevant experience')).toBeInTheDocument();
    // Use getAllByText and select the first occurrence of 'Gaps:'
    const gapsTexts = screen.getAllByText(/Gaps:/i);
    expect(gapsTexts[0]).toBeInTheDocument();
    expect(screen.getByText('No experience with cloud platforms')).toBeInTheDocument();
  });

  it('displays education match information', () => {
    render(<JobMatchCard match={mockMatch} />);
    expect(screen.getByText('Bachelor degree in Computer Science')).toBeInTheDocument();
    // Use getAllByText and select the second occurrence of 'Gaps:'
    const gapsTexts = screen.getAllByText(/Gaps:/i);
    expect(gapsTexts[1]).toBeInTheDocument();
    expect(screen.getByText('No specialized certifications')).toBeInTheDocument();
  });

  it('applies correct color classes for high scores', () => {
    render(<JobMatchCard match={mockMatch} />);
    const progressBars = document.querySelectorAll('.bg-green-100');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('applies correct color classes for medium scores', () => {
    render(<JobMatchCard match={mockMediumMatch} />);
    const progressBars = document.querySelectorAll('.bg-yellow-100');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('applies correct color classes for low scores', () => {
    render(<JobMatchCard match={mockLowMatch} />);
    const progressBars = document.querySelectorAll('.bg-red-100');
    expect(progressBars.length).toBeGreaterThan(0);
  });
});