"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { Jobs } from "@prisma/client";

interface JobViewProps {
  job: Jobs;
}

export default function JobView({ job }: JobViewProps) {
  const router = useRouter();

  return (
    <main>
      <div className="container mx-auto p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="prose dark:prose-invert">
              <h2 className="text-xl font-semibold">Description</h2>
              <p>{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-semibold">Experience</span>
                    </div>
                    <p className="text-muted-foreground">{job.experience}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-semibold">Education</span>
                    </div>
                    <p className="text-muted-foreground">{job.education}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Technical Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.technicalRequirements.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.softSkills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}