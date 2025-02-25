import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Challenge",
  description: "ATS Challenge",
};
import { ThemeProvider } from "@/components/theme-provider";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${urbanist.className} antialiased scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
