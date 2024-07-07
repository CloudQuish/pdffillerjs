import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PDF Filler API | REVESH",
  description: "Free, open-source pdf field extractor, and filler API.",
  openGraph: {
    title: "PDF Filler API | REVESH",
    description: "Free, open-source pdf field extractor, and filler API.",
    type: "website",
    url: "https://filler.revesh.com",
    locale: "en_US",
    siteName: "PDF Filler API | REVESH",
    images: [
      {
        url: "https://filler.revesh.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free and Open-Source SaaS Landing Page",
        type: "image/jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Filler API | REVESH",
    description: "Free, open-source pdf field extractor, and filler API.",
    images: [
      {
        url: "https://filler.revesh.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free, open-source pdf field extractor, and filler API.",
        type: "image/jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
