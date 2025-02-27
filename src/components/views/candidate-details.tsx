import { FC } from 'react';
import { Badge } from "@/components/ui/badge";

interface CandidateDetailsProps {
  candidate: CandidateResult;
}

export const CandidateDetails: FC<CandidateDetailsProps> = ({ candidate }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
            <div className="space-y-2">
              <p>Name: {candidate.candidateDetails.personalDetails.name}</p>
              <p>Email: {candidate.candidateDetails.personalDetails.email}</p>
              <p>Contact: {candidate.candidateDetails.personalDetails.contact}</p>
              <p>Location: {candidate.candidateDetails.personalDetails.location}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">All Job Matches</h3>
          <div className="space-y-3">
            {candidate.jobMatches.map((match, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>{match.jobTitle}</span>
                <Badge 
                  variant="outline" 
                  className={`${
                    match.analysis.overallScore >= 80 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : match.analysis.overallScore >= 60
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {Math.round(match.analysis.overallScore)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;