import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { DocumentWithTags } from "@/lib/supabase/supabase.types";
import {
  CornerDownLeft,
  Dot,
  ExternalLink,
  FileText,
  Link2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type CommandSearchItemProps = {
  workspaceId: string;
  title: string;
  documentId: string;
  createdAt: string;
};

const CommandSearchItem: React.FC<CommandSearchItemProps> = ({
  workspaceId,
  title,
  documentId,
  createdAt,
}) => {
  const router = useRouter();

  const handleOnSelect = () => {
    return router.push(`/dashboard/${workspaceId}/${documentId}`);
  };
  return (
    <>
      <CommandItem
        className="flex items-center pt-0 pb-0 hover:cursor-pointer"
        onSelect={() => handleOnSelect()}
      >
        <FileText className="h-4 w-4" />
        <div className="ml-2">
          <Label>{title}</Label>
          <div className="flex items-center text-xs text-teal-600">
            <span>Docs</span>
            <Dot />
            <span>{createdAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-x-2 ml-auto">
          <div className="text-sm bg-green-500 hover:bg-green-300 p-1 rounded-lg">
            <CornerDownLeft className="h-4 w-4" />
          </div>
        </div>
      </CommandItem>
    </>
  );
};

export default CommandSearchItem;
