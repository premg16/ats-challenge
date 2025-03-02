"use client";

import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCandidateStore } from "@/lib/store/candidateStore";
import { CandidateResult, CandidateSchema } from "@/lib/types";

export const ResultsTable = () => {
    const { results } = useCandidateStore();
    const router = useRouter();

    if (!results) return <div>Something Went Wrong</div>;

    // extract candidates from results, results is an array of objects of single array of candidates and job matches array
    const candidates = results.map((result) => result.candidate[0]);

    const handleViewDetails = (candidate: CandidateSchema) => {
        if (candidate) {
            router.push(
                `/candidate?name=${encodeURIComponent(
                    JSON.stringify(candidate.personalDetails.name),
                )}`,
            );
        }
    };

    return (
        <div className="rounded-md border shadow-sm transition-shadow duration-200 hover:shadow-md">
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
                    {candidates.map(
                        (candidate: CandidateResult, index: number) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {
                                        candidate.candidateDetails
                                            .personalDetails.name
                                    }
                                </TableCell>
                                <TableCell>
                                    {candidate.candidateDetails.personalDetails
                                        .email ||
                                        candidate.candidateDetails
                                            .personalDetails.contact}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {
                                            candidate.candidateDetails
                                                .personalDetails.role
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {candidate.jobMatches
                                            .sort(
                                                (a, b) =>
                                                    b.analysis.overallScore -
                                                    a.analysis.overallScore,
                                            )
                                            .slice(0, 2)
                                            .map((match, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-sm">
                                                        {match.jobTitle}
                                                    </span>
                                                    <Badge variant="outline">
                                                        {Math.round(
                                                            match.analysis
                                                                .overallScore,
                                                        )}
                                                        %
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleViewDetails(
                                                candidate.candidateDetails,
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ResultsTable;
