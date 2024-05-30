"use client";
import { LoadingEditor } from "@/components/Loading";
import Loader from "@/components/global/Loader";
import Sidebar from "@/components/sidebar/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import React, { Suspense, useState } from "react";
interface LayoutProps {
  children: React.ReactNode;
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
              <Suspense fallback={<LoadingEditor />}>
                <Sidebar isCollapsed={isCollapsed} params={params} />
              </Suspense>
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
            <div className="flex h-full justify-center p-2 m-2 rounded-sm bg-background shadow-2xl">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
