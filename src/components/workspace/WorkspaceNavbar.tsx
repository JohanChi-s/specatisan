'use client';

import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WorkspaceNavbar = () => {
  return (
    <div className="flex items-center justify-center w-full h-12 rounded-sm mb-6">
      <Tabs defaultValue="all">
        <div className="flex items-center px-4 py-2">
          <TabsList className="ml-auto">
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
            >
              All docs
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Collections
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Tags
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <TabsContent value="all" className="m-0"></TabsContent>
        <TabsContent value="collections" className="m-0"></TabsContent>
        <TabsContent value="tags" className="m-0"></TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceNavbar;
