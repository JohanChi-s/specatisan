"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppState } from "@/lib/providers/state-provider";
import { updateDocument } from "@/lib/supabase/queries";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import TooltipComponent from "../global/tooltip-component";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";
import WorkspaceBreadcumb, { BreadcrumbItemProps } from "./WorkspaceBreadcumb";

type WorkspaceNavbarProps = {
  title?: string;
  documentId?: string;
  items?: BreadcrumbItemProps[];
  isShowTabs?: boolean;
};

const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({
  documentId,
  items,
  title,
  isShowTabs = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [docTitle, setDocTitle] = useState(title);
  const router = useRouter();
  const { workspaceId } = useAppState();

  if (!workspaceId) return redirect("/dashboard");

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    if (!isEditing) return;
    setIsEditing(false);

    if (!documentId) {
      return toast({
        title: "Error",
        variant: "destructive",
        description: "Could not update the title for this document 1",
      });
    } else {
      const { data, error } = await updateDocument(
        { title: docTitle },
        documentId
      );
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update the title for this document",
        });
      } else
        toast({
          title: "Success",
          description: "Document title changed.",
        });
    }
  };

  const documentTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocTitle(e.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between w-full h-12 rounded-sm mb-1">
      {/* Create a back button with nextjs */}
      <div className="flex items-center">
        <Button variant={"ghost"} onClick={() => handleBack()}>
          <ChevronLeft size={24} />
        </Button>
        <WorkspaceBreadcumb items={items} />
        {/* Breadcumb here */}
        {title && (
          <TooltipComponent message="Change title">
            <input
              type="text"
              value={docTitle || "Untitled"}
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                {
                  "bg-muted cursor-text": isEditing,
                  "bg-transparent cursor-pointer": !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={documentTitleChange}
            />
          </TooltipComponent>
        )}
      </div>
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
