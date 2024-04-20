'use client';
import MobileSidebar from '@/components/sidebar/mobile-sidebar';
import Sidebar from '@/components/sidebar/sidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
  AlertCircle,
  Archive,
  Inbox,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from 'lucide-react';
import React, { useState } from 'react';

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
    <div className="flex w-full h-main-container-height">
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
          <ResizablePanel defaultSize={defaultProps.defaultLayout[1]}>
            <div className="flex h-full justify-center p-6">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
