import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Upload, Brain, BarChart3 } from "lucide-react";

export default function Page() {
  return (
    <main className="max-h-svh bg-gradient-to-br from-background to-primary/10 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative min-h-svh flex items-center justify-center">
        <div className="absolute inset-0 -z-10" />
        <div className="container mx-auto px-4 py-32 text-center ">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                Transform Your
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Hiring </span>
                Process
              </h1>
              <p className="text-xl text-muted-foreground">
                AI-powered candidate ranking system that revolutionizes how you hire for blue-collar & sales roles.
              </p>
            </div>
            <div className="flex gap-4 w-full justify-center">
              <Button size="lg" className="group">
                Get Started
                <svg
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-muted-foreground mt-4">
              Everything you need to streamline your recruitment process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart CV Upload</h3>
              <p className="text-muted-foreground">
                Bulk upload CVs in any format. Our AI handles the rest.
              </p>
            </Card>

            <Card className="group relative overflow-hidden p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms extract and analyze candidate information with high precision.
              </p>
            </Card>

            <Card className="group relative overflow-hidden p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Ranking</h3>
              <p className="text-muted-foreground">
                Get instant candidate rankings with detailed match scores.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of companies already using Recruit Raid to find their perfect candidates.
            </p>
            <Button size="lg">
              <Link href="/dashboard">Try for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
