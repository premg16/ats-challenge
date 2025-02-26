import { FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Score {
  overallScore: number;
  technicalScore: number;
  softSkillScore: number;
  experienceScore: number;
  educationScore: number;
}

interface JobMatch {
  jobTitle: string;
  score: Score;
}

interface CandidateSchema {
  personalDetails: {
    name: string;
    contact: string;
    email: string;
    location: string;
    role: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: [
    {
      jobTitle: string;
      company: string;
      location: string;
      duration: {
        startDate: string;
        endDate: string;
      };
      responsibilities: string[];
      achievements: string[];
    }
  ];
  education: [
    {
      degree: string;
      institution: string;
      year: string;
    }
  ];
  certifications: [
    {
      name: string;
      issuer: string;
      year: string;
    }
  ];
  additionalInfo: {
    availability: string;
    desiredSalary: string;
    location: string;
  };
}

interface CandidateResult {
  candidateDetails: CandidateSchema;
  jobMatches: JobMatch[];
}

interface ProcessingResult {
  candidates: CandidateResult[];
  error?: string;
}

interface ResultsTableProps {
  results: ProcessingResult[];
}

const CandidateDetails: FC<{ candidate: CandidateResult }> = ({ candidate }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Personal Details</h3>
          <p>Name: {candidate.candidateDetails.personalDetails.name}</p>
          <p>Email: {candidate.candidateDetails.personalDetails.email}</p>
          <p>Contact: {candidate.candidateDetails.personalDetails.contact}</p>
          <p>Location: {candidate.candidateDetails.personalDetails.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">All Job Matches</h3>
          <div className="space-y-2">
            {candidate.jobMatches.map((match, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{match.jobTitle}</span>
                <span className="font-semibold">{Math.round(match.score.overallScore)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResultsTable: FC<ResultsTableProps> = ({ results }) => {
  console.log(results);
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Top Matches</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => 
            result.candidates.map((candidate, candidateIndex) => (
              <TableRow key={`${index}-${candidateIndex}`}>
                <TableCell className="font-medium">
                  {candidate.candidateDetails.personalDetails.name}
                </TableCell>
                <TableCell>
                  {candidate.candidateDetails.personalDetails.email || 
                   candidate.candidateDetails.personalDetails.contact}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {candidate.candidateDetails.personalDetails.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {candidate.jobMatches
                      .sort((a, b) => b.score.overallScore - a.score.overallScore)
                      .slice(0, 2)
                      .map((match, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm">{match.jobTitle}</span>
                          <Badge variant="outline">
                            {Math.round(match.score.overallScore)}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Candidate Details</DialogTitle>
                      </DialogHeader>
                      <CandidateDetails candidate={candidate} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
          {results.map((result, index) => 
            result.error && (
              <TableRow key={`error-${index}`}>
                <TableCell colSpan={5} className="text-red-500">
                  {result.error}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;