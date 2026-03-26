import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TrialFinder — ER+/HER2- Breast Cancer Clinical Trials",
  description:
    "Find clinical trials worldwide for ER-positive, HER2-negative breast cancer. Search, filter, and explore trial details with the latest research news.",
  openGraph: {
    title: "TrialFinder — ER+/HER2- Breast Cancer Clinical Trials",
    description:
      "Find clinical trials worldwide for ER-positive, HER2-negative breast cancer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
