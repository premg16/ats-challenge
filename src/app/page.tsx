import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Upload, Brain, BarChart3 } from "lucide-react";

export default function Page() {
    return (
        <main className="max-h-svh overflow-y-auto bg-gradient-to-br from-background to-primary/10">
            {/* Hero Section */}
            <section className="relative flex min-h-svh items-center justify-center">
                <div className="absolute inset-0 -z-10" />
                <div className="container mx-auto px-4 py-32 text-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
                                Transform Your
                                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                    {" "}
                                    Hiring{" "}
                                </span>
                                Process
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                AI-powered candidate ranking system that
                                revolutionizes how you hire for blue-collar &
                                sales roles.
                            </p>
                        </div>
                        <div className="flex w-full justify-center gap-4">
                            <Button size="lg" className="group">
                                Get Started
                                <svg
                                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
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
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                            Powerful Features
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Everything you need to streamline your recruitment
                            process
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="group relative overflow-hidden p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Smart CV Upload
                            </h3>
                            <p className="text-muted-foreground">
                                Bulk upload CVs in any format. Our AI handles
                                the rest.
                            </p>
                        </Card>

                        <Card className="group relative overflow-hidden p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                AI Analysis
                            </h3>
                            <p className="text-muted-foreground">
                                Advanced algorithms extract and analyze
                                candidate information with high precision.
                            </p>
                        </Card>

                        <Card className="group relative overflow-hidden p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <BarChart3 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Smart Ranking
                            </h3>
                            <p className="text-muted-foreground">
                                Get instant candidate rankings with detailed
                                match scores.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section>
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="mx-auto max-w-2xl space-y-8">
                        <h2 className="text-4xl font-bold">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Join hundreds of companies already using Recruit
                            Raid to find their perfect candidates.
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
