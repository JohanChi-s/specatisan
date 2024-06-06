"use client";
import { LoadingEditor } from "@/components/Loading";
import { useSidebar } from "@/components/chat/lib/hooks/use-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { Suspense } from "react";
interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex w-full h-screen bg-background font-sans antialiased">
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "flex bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto duration-300 transition-all",
            "dark:bg-black lg:dark:bg-black/30",
            isSidebarOpen && "border-r-transparent hidden",
            !isSidebarOpen &&
              "w-80 border-r border-r-neutral-200 dark:border-r-neutral-800 p-3"
          )}
        >
          <Suspense fallback={<LoadingEditor />}>
            <Sidebar
              isOpen={isSidebarOpen}
              toggle={toggleSidebar}
              params={params}
            />
          </Suspense>
        </div>

        <div className="flex w-full flex-1 h-full justify-center p-2 m-2 rounded-sm bg-background shadow-2xl">
          {children}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
