import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import QueryProvider from "@/providers/QueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./provider";
import UserContextWrapper from "@/context/UserContext";
import ChatWidget from "@/components/global/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnzilla | Learn from Industry Experts",
  description: "Connect with expert tutors, master new skills, and bridge the gap between learning and doing. The premier platform for personalized online education.",
  keywords: ["education", "tutors", "online learning", "mentorship", "skill building"],
  authors: [{ name: "Learnzilla Team" }],
  openGraph: {
    title: "Learnzilla - Learn from experts",
    description: "Connect with expert tutors and master new skills.",
    url: "https://learnzilla.com",
    siteName: "Learnzilla",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnzilla | Learn from Industry Experts",
    description: "The premier platform for personalized online education.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      
       <Providers>
          <UserContextWrapper>
            {children}
          </UserContextWrapper>
        </Providers>
        <ChatWidget />
      </body>
    </html>
  );
}

