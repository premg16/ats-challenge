import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
    title: "Recruit Raid",
    description: "ATS Challenge",
};
import { ThemeProvider } from "@/components/theme-provider";
import { Urbanist } from "next/font/google";
import Header from "@/components/views/header";

const urbanist = Urbanist({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body
                className={`${urbanist.className} max-h-svh overflow-hidden scroll-smooth antialiased`}
            >
                <Toaster richColors />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
