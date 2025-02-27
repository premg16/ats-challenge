import { AlertCircle, BookOpen, Briefcase, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface JobMatchCardProps {
    match: {
        jobTitle: string;
        analysis: {
            overallScore: number;
            justification: string;
            keyMatchingHighlights: string[];
            keyGaps: string[];
            technicalSkillsMatch: {
                score: number;
                matching: string[];
                missing: string[];
            };
            softSkillsMatch: {
                score: number;
                matching: string[];
                missing: string[];
            };
            experienceMatch: {
                score: number;
                matching: string;
                gaps?: string;
            };
            educationMatch: {
                score: number;
                matching: string;
                gaps?: string;
            };
        };
    };
}

export function JobMatchCard({ match }: JobMatchCardProps) {
    // Helper function to get color class based on score
    const getScoreColorClass = (score: number) => {
        return score >= 80
            ? "bg-green-100 [&>div]:bg-green-500 dark:bg-green-500/20"
            : score >= 60
              ? "bg-yellow-100 [&>div]:bg-yellow-500 dark:bg-yellow-500/20"
              : "bg-red-100 [&>div]:bg-red-500 dark:bg-red-500/20";
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{match.jobTitle}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Score Overview */}
                    <div className="space-y-6">
                        {/* Circular Score Chart */}
                        <div className="relative mx-auto h-48 w-48">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">
                                        {Math.round(
                                            match.analysis.overallScore,
                                        )}
                                        %
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Overall Match
                                    </div>
                                </div>
                            </div>
                            <svg className="h-full w-full -rotate-90 transform">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="16"
                                    fill="transparent"
                                    className="text-muted-foreground/20"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="16"
                                    fill="transparent"
                                    strokeDasharray={553}
                                    strokeDashoffset={
                                        553 -
                                        (553 * match.analysis.overallScore) /
                                            100
                                    }
                                    className={`${
                                        match.analysis.overallScore >= 80
                                            ? "text-green-500"
                                            : match.analysis.overallScore >= 60
                                              ? "text-yellow-500"
                                              : "text-red-500"
                                    }`}
                                />
                            </svg>
                        </div>

                        {/* Analysis Summary */}
                        <div className="space-y-2">
                            <h4 className="font-semibold">Analysis Summary</h4>
                            <p className="text-sm text-muted-foreground">
                                {match.analysis.justification ||
                                    "No detailed analysis available."}
                            </p>
                        </div>

                        {/* Key Highlights & Gaps */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <Trophy className="h-4 w-4 text-green-500" />
                                    Key Matching Highlights
                                </h4>
                                {match.analysis.keyMatchingHighlights &&
                                match.analysis.keyMatchingHighlights.length >
                                    0 ? (
                                    <ul className="space-y-1">
                                        {match.analysis.keyMatchingHighlights.map(
                                            (highlight, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <div className="mt-0.5 rounded-full bg-green-500/10 p-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                    </div>
                                                    <span className="text-green-700 dark:text-green-500">
                                                        {highlight}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No key highlights identified.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    Key Gaps
                                </h4>
                                {match.analysis.keyGaps &&
                                match.analysis.keyGaps.length > 0 ? (
                                    <ul className="space-y-1">
                                        {match.analysis.keyGaps.map(
                                            (gap, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <div className="mt-0.5 rounded-full bg-red-500/10 p-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                    </div>
                                                    <span className="text-red-700 dark:text-red-500">
                                                        {gap}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No significant gaps identified.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Skills Analysis */}
                    <div className="space-y-6">
                        {/* Score Breakdown with Progress Bars */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Score Breakdown</h4>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Technical Skills</span>
                                        <span>
                                            {
                                                match.analysis
                                                    .technicalSkillsMatch.score
                                            }
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            match.analysis.technicalSkillsMatch
                                                .score
                                        }
                                        className={getScoreColorClass(
                                            match.analysis.technicalSkillsMatch
                                                .score,
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Soft Skills</span>
                                        <span>
                                            {
                                                match.analysis.softSkillsMatch
                                                    .score
                                            }
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            match.analysis.softSkillsMatch.score
                                        }
                                        className={getScoreColorClass(
                                            match.analysis.softSkillsMatch
                                                .score,
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Experience</span>
                                        <span>
                                            {
                                                match.analysis.experienceMatch
                                                    .score
                                            }
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            match.analysis.experienceMatch.score
                                        }
                                        className={getScoreColorClass(
                                            match.analysis.experienceMatch
                                                .score,
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Education</span>
                                        <span>
                                            {
                                                match.analysis.educationMatch
                                                    .score
                                            }
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            match.analysis.educationMatch.score
                                        }
                                        className={getScoreColorClass(
                                            match.analysis.educationMatch.score,
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Technical Skills */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                    Technical Skills
                                </h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="mb-2 text-sm font-medium">
                                        Matching Skills
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {match.analysis.technicalSkillsMatch
                                            .matching &&
                                        match.analysis.technicalSkillsMatch
                                            .matching.length > 0 ? (
                                            match.analysis.technicalSkillsMatch.matching.map(
                                                (skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="bg-green-500/10 text-green-700 dark:text-green-500"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No matching technical skills
                                                found.
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 text-sm font-medium">
                                        Missing Skills
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {match.analysis.technicalSkillsMatch
                                            .missing &&
                                        match.analysis.technicalSkillsMatch
                                            .missing.length > 0 ? (
                                            match.analysis.technicalSkillsMatch.missing.map(
                                                (skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="bg-red-500/10 text-red-700 dark:text-red-500"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No missing technical skills
                                                identified.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Soft Skills */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">Soft Skills</h4>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="mb-2 text-sm font-medium">
                                        Matching Skills
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {match.analysis.softSkillsMatch
                                            .matching &&
                                        match.analysis.softSkillsMatch.matching
                                            .length > 0 ? (
                                            match.analysis.softSkillsMatch.matching.map(
                                                (skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="bg-green-500/10 text-green-700 dark:text-green-500"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No matching soft skills found.
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 text-sm font-medium">
                                        Missing Skills
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {match.analysis.softSkillsMatch
                                            .missing &&
                                        match.analysis.softSkillsMatch.missing
                                            .length > 0 ? (
                                            match.analysis.softSkillsMatch.missing.map(
                                                (skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="bg-red-500/10 text-red-700 dark:text-red-500"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No missing soft skills
                                                identified.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Experience & Education */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <Briefcase className="h-4 w-4" /> Experience
                                </h4>
                                <div className="text-sm">
                                    <p className="text-muted-foreground">
                                        {match.analysis.experienceMatch
                                            .matching ||
                                            "No experience match details available."}
                                    </p>
                                    {match.analysis.experienceMatch.gaps && (
                                        <p className="mt-2 text-red-500">
                                            <span className="font-medium">
                                                Gaps:{" "}
                                            </span>
                                            {
                                                match.analysis.experienceMatch
                                                    .gaps
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 font-semibold">
                                    <BookOpen className="h-4 w-4" /> Education
                                </h4>
                                <div className="text-sm">
                                    <p className="text-muted-foreground">
                                        {match.analysis.educationMatch
                                            .matching ||
                                            "No education match details available."}
                                    </p>
                                    {match.analysis.educationMatch.gaps && (
                                        <p className="mt-2 text-red-500">
                                            <span className="font-medium">
                                                Gaps:{" "}
                                            </span>
                                            {match.analysis.educationMatch.gaps}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
