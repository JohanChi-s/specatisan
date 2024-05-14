"use client";
import Sidebar from "@/components/sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { getAllWorkspaces } from "@/lib/supabase/queries";
import { collections, documents } from "@/lib/supabase/schema";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
interface LayoutProps {
  children: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  params: any;
}

const defaultProps = {
  defaultLayout: [265, 1095],
  defaultCollapsed: false,
  navCollapsedSize: 4,
};

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultProps.defaultCollapsed);

  return (
    <div className="flex w-full h-screen bg-background font-sans antialiased">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[350px] h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultProps.defaultLayout[0]}
            minSize={20}
            maxSize={30}
          >
            <div className="flex h-full justify-center p-4">
              <Sidebar isCollapsed={isCollapsed} params={params} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="h-full" />
          <ResizablePanel
            className={cn(
              "bg-background font-sans antialiased",
              "[&_.slate-selected]:!bg-primary/20 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary [&_.slate-selection-area]:bg-primary/10"
            )}
            suppressHydrationWarning
            defaultSize={defaultProps.defaultLayout[1]}
          >
            <div className="flex h-full justify-center p-2 m-2 rounded-sm bg-white shadow-2xl">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
