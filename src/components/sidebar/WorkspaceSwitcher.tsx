"use client";

import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { useAppState } from "@/lib/providers/state-provider";
import { Workspace } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { Cloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import WorkspaceCreator from "../global/workspace-creator";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface WorkspaceSwitcherProps extends PopoverTriggerProps {
  privateWorkspaces: Workspace[] | [];
  sharedWorkspaces: Workspace[] | [];
  collaboratingWorkspaces: Workspace[] | [];
  defaultWorkspace: Workspace | undefined;
}

export default function WorkspaceSwitcher({
  className,
  privateWorkspaces,
  sharedWorkspaces,
  collaboratingWorkspaces,
  defaultWorkspace,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
    React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<
    Workspace | undefined
  >(defaultWorkspace);
  const { state } = useAppState();

  const handleSelect = (option: Workspace) => {
    setSelectedWorkspace(option);
    setOpen(false);
  };

  React.useEffect(() => {
    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultWorkspace?.id
    );
    if (findSelectedWorkspace) setSelectedWorkspace(findSelectedWorkspace);
  }, [state, defaultWorkspace]);

  return (
    <Dialog
      open={showNewWorkspaceDialog}
      onOpenChange={setShowNewWorkspaceDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex w-full items-center cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="outline-1 outline-emerald-900">
                AV
              </AvatarFallback>
            </Avatar>
            <div className="flex-col p-2 w-full justify-start">
              <div className="font-bold text-base">Workspace Name</div>
              <div className="font-light text-sm text-left flex items-center">
                <Cloud size={20} className="mr-2" />
                <span>Cloud</span>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-50">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Workspaces">
                {privateWorkspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    onSelect={() => handleSelect(workspace)}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${workspace.bannerUrl}.png`}
                        alt={workspace.title}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {workspace.title}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedWorkspace?.id === workspace.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewWorkspaceDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <CustomDialogTrigger
            header="Create A Workspace"
            content={<WorkspaceCreator />}
            description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
          >
            <div
              className="flex 
              transition-all 
              hover:bg-muted 
              justify-center 
              items-center 
              gap-2 
              p-2 
              w-full"
            >
              <article
                className="text-slate-500 
                rounded-full
                 bg-slate-800 
                 w-4 
                 h-4 
                 flex 
                 items-center 
                 justify-center"
              >
                +
              </article>
              Create workspace
            </div>
          </CustomDialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
