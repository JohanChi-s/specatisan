export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import AppStateProvider from "@/lib/providers/state-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/lib/providers/socket-provider";
import db from "@/lib/supabase/db";
const inter = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demos.speacatisan.dev"),
  title: "Speacatisan editor ",
  description:
    "Speacatisan is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.",
  robots: "noindex, nofollow",
  icons: [{ url: "/favicon.svg" }],
  twitter: {
    card: "summary_large_image",
    site: "@Speacatisan_editor",
    creator: "@Speacatisan_editor",
  },
  openGraph: {
    title: "Speacatisan editor ",
    description:
      "Speacatisan is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(db);
  return (
    <html lang="en">
      <body className={twMerge("bg-background", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseUserProvider>
            <AppStateProvider>
              <SocketProvider>
                {children}
                <Toaster />
              </SocketProvider>
            </AppStateProvider>
          </SupabaseUserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
