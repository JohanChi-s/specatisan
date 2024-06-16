"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { useAppState } from "@/lib/providers/state-provider";
import { Workspace } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { Cloud, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import WorkspaceCreator from "../global/workspace-creator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { isCollapsed } from "@udecode/slate";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface WorkspaceSwitcherProps extends PopoverTriggerProps {
  privateWorkspaces: Workspace[] | [];
  sharedWorkspaces: Workspace[] | [];
  collaboratingWorkspaces: Workspace[] | [];
  isCollapsed?: boolean;
}

export default function WorkspaceSwitcher({
  privateWorkspaces,
  collaboratingWorkspaces,
  isCollapsed,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { dispatch } = useAppState();
  const router = useRouter();
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<
    Workspace | undefined
  >();
  const { state } = useAppState();

  const handleSelect = (option: Workspace) => {
    setSelectedWorkspace(option);
    dispatch({
      type: "SET_CURRENT_WORKSPACES",
      payload: { workspace: option },
    });
    setOpen(false);

    router.push(`/dashboard/${option.id}/alldocs`);
  };

  React.useEffect(() => {
    setSelectedWorkspace(state.currentWorkspace || state.workspaces[0]);
  }, [state.currentWorkspace, state.workspaces]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isCollapsed ? (
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="outline-1 outline-emerald-900">
              W
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex w-full items-center cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="outline-1 outline-emerald-900">
                W
              </AvatarFallback>
            </Avatar>
            <div className="flex-col p-2 w-full justify-start">
              <div className="font-bold text-base">
                {selectedWorkspace?.title}
              </div>
              <div className="font-light text-sm text-left flex items-center">
                <Cloud size={20} className="mr-2" />
                <span>Cloud</span>
              </div>
            </div>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-50">
        <Command>
          <CommandList>
            <CommandGroup heading="Workspaces">
              {privateWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => handleSelect(workspace)}
                  className="text-sm cursor-pointer my-1 flex flex-1 items-center hover:bg-slate-200 justify-start p-2 rounded-md"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${workspace.bannerUrl}.png`}
                      alt={workspace.title}
                      className="grayscale"
                    />
                    <AvatarFallback>Workspace</AvatarFallback>
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
                </div>
              ))}
              {collaboratingWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => handleSelect(workspace)}
                  className="text-sm cursor-pointer my-1 flex flex-1 items-center hover:bg-slate-200 justify-start p-2 rounded-md"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${workspace.bannerUrl}.png`}
                      alt={workspace.title}
                      className="grayscale"
                    />
                    <AvatarFallback>Workspace</AvatarFallback>
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
                </div>
              ))}
              {/* {sharedWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => handleSelect(workspace)}
                  className="text-sm cursor-pointer my-1 flex flex-1 items-center hover:bg-slate-200 justify-start p-2 rounded-md"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${workspace.bannerUrl}.png`}
                      alt={workspace.title}
                      className="grayscale"
                    />
                    <AvatarFallback>Workspace</AvatarFallback>
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
                </div>
              ))} */}
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CustomDialogTrigger
                header="Create A Workspace"
                content={<WorkspaceCreator />}
                description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
              >
                <Button variant={"default"} className="w-full flex flex-1">
                  <PlusIcon /> Create Workspace
                </Button>
              </CustomDialogTrigger>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
