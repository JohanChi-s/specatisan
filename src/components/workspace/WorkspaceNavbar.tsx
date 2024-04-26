"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";

type WorkspaceNavbarProps = {
  workspaceId?: string;
  isShowTabs?: boolean;
};

const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({
  workspaceId,
  isShowTabs = true,
}) => {
  return (
    <div className="flex items-center justify-between w-full h-12 rounded-sm mb-6">
      {/* Create a back button with nextjs */}
      <Button variant={"ghost"} onClick={() => {}}>
        <ChevronLeft size={24} />
      </Button>
      {isShowTabs && (
        <Tabs defaultValue="all">
          <div className="flex items-center px-4 py-2">
            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                <Link href={`/dashboard/${workspaceId}/alldocs`}>All docs</Link>
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="text-zinc-600 dark:text-zinc-200"
              >
                <Link href={`/dashboard/${workspaceId}/collections`}>
                  Collections
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="tags"
                className="text-zinc-600 dark:text-zinc-200"
              >
                <Link href={`/dashboard/${workspaceId}/tags`}>Tags</Link>
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
        </Tabs>
      )}
    </div>
  );
};

export default WorkspaceNavbar;
