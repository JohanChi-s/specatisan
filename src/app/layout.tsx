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
import { Provider } from "mobx-react";
import stores from "@/stores";

const inter = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(db);

  return (
    <html lang="en">
      <body className={twMerge("bg-background", inter.className)}>
        <Provider {...stores}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AppStateProvider>
              <SupabaseUserProvider>
                <SocketProvider>
                  {children}
                  <Toaster />
                </SocketProvider>
              </SupabaseUserProvider>
            </AppStateProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
