"use client";

import { FC, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCandidateStore } from "@/lib/store/candidateStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JobMatchCard } from "@/components/job-match-card";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function CandidatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { results } = useCandidateStore();

  const candidateName = searchParams.get("name");
  const candidate =
    results.length > 0
      ? results.find(
          (result) =>
            result.candidate[0].candidateDetails.personalDetails.name ===
            JSON.parse(candidateName || "")
        )?.candidate[0]
      : null;

  if (!candidate) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Candidate not found
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { candidateDetails, jobMatches } = candidate;
  const { personalDetails, experience, education } = candidateDetails;

  return (
    <div className="mx-auto p-2 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex gap-2">
        <Card className="border-2 w-full max-w-sm h-fit">
          <CardHeader>
            <div className="flex gap-4 items-start">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary/10">
                  {personalDetails.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {personalDetails.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {personalDetails.role}
                    </CardDescription>
                  </div>
                  <Badge className="text-xs px-2 py-1" variant="secondary">
                    Available
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {personalDetails.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {personalDetails.contact}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {personalDetails.location}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis">Job Match Analysis</TabsTrigger>
            <TabsTrigger value="profile">Full Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="grid gap-6">
              {jobMatches
                .sort(
                  (a, b) => b.analysis.overallScore - a.analysis.overallScore
                )
                .map((match, index) => (
                  <JobMatchCard key={index} match={match} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="grid gap-6">
              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy size={16} /> Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidateDetails.skills.technical.map((skill, i) => (
                          <Badge key={i} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidateDetails.skills.soft.map((skill, i) => (
                          <Badge key={i} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{exp.jobTitle}</h3>
                          <p className="text-muted-foreground">
                            {exp.company} • {exp.location}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {exp.duration.startDate} - {exp.duration.endDate}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold">
                            Key Responsibilities
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">
                            Achievements
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {index < experience.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education & Certifications */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" /> Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {edu.institution}
                        </p>
                        {index < education.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" /> Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidateDetails.certifications.map((cert, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <Badge variant="outline">{cert.year}</Badge>
                        </div>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                        {index < candidateDetails.certifications.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const CandidatePage: FC = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading candidate details...</div>}>
      <CandidatePageContent />
    </Suspense>
  );
};

export default CandidatePage;
