export const dynamic = "force-dynamic";

import { AI } from "@/components/chat/lib/chat/actions";
import { SidebarProvider } from "@/components/chat/lib/hooks/use-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import AppStateProvider from "@/lib/providers/state-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";
import "./globals.css";
import { SubscriptionModalProvider } from "@/lib/providers/subscription-modal-provider";
import { getActiveProductsWithPrice } from "@/lib/supabase/queries";
const inter = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(db);
  const { data: products, error } = await getActiveProductsWithPrice();
  if (error) throw new Error();
  return (
    <html lang="en">
      <body className={twMerge("bg-background", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SupabaseUserProvider>
            <SubscriptionModalProvider products={products}>
              <AppStateProvider>
                <TooltipProvider delayDuration={0}>
                  <AI>
                    <SidebarProvider>{children}</SidebarProvider>
                  </AI>
                  <Toaster />
                </TooltipProvider>
              </AppStateProvider>
            </SubscriptionModalProvider>
          </SupabaseUserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
