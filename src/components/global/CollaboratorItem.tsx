"use client";
import { Collaborator } from "@/lib/supabase/supabase.types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Colab } from "./workspace-creator";
import { useState } from "react";

interface CollaboratorItemProps {
  collaborator: Colab;
  updateColabPermission: (collaborator: Colab) => void;
  removeCollaborator: (collaborator: Colab) => void;
  editable?: boolean;
}

const ConvertToPermission = (permission: string) => {
  switch (permission) {
    case "read":
      return "Viewer";
    case "edit":
      return "Editor";
    case "admin":
      return "Admin";
    default:
      return "Viewer";
  }
};

const CollaboratorItem: React.FC<CollaboratorItemProps> = ({
  collaborator,
  updateColabPermission,
  editable,
  removeCollaborator,
}) => {
  const [permission, setPermission] = useState(collaborator.permission);

  const updatePermission = (permission: string) => {
    setPermission(permission);
    updateColabPermission({ ...collaborator, permission });
  };
  return (
    <div
      className="p-4 flex justify-between items-center"
      key={collaborator.id}
    >
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage src="/avatars/7.png" />
          <AvatarFallback>PJ</AvatarFallback>
        </Avatar>
        <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]">
          {collaborator.email}
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            disabled={!editable || false}
          >
            {ConvertToPermission(permission)}
            <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end">
          <Command>
            <CommandInput placeholder="Select new role..." />
            <CommandList>
              <CommandEmpty>No roles found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => updatePermission("read")}
                  className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                >
                  <p>Viewer</p>
                  <p className="text-sm text-muted-foreground">
                    Can view and comment.
                  </p>
                </CommandItem>
                <CommandItem
                  onSelect={() => updatePermission("edit")}
                  className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                >
                  <p>Editor</p>
                  <p className="text-sm text-muted-foreground">
                    Can view, comment and edit.
                  </p>
                </CommandItem>
                <CommandItem
                  onSelect={() => updatePermission("admin")}
                  className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                >
                  <p>Admin</p>
                  <p className="text-sm text-muted-foreground">
                    Admin-level access to all resources.
                  </p>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        className="ml-2"
        variant="secondary"
        disabled={!editable}
        onClick={() => removeCollaborator(collaborator)}
      >
        Remove
      </Button>
    </div>
  );
};

export default CollaboratorItem;
