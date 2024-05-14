"use client";

import {
  Archive,
  Calculator,
  CreditCard,
  Settings,
  Smile,
  Target,
  User,
  User2,
  Users,
} from "lucide-react";
import CommandSearchItem from "./CommandSearchItem";
import { QuickFilterCombobox } from "./QuickFilterCombobox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DocumentWithTags } from "@/lib/supabase/supabase.types";
import { useAppState } from "@/lib/providers/state-provider";

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentWithTags[]>([]);
  const { state } = useAppState();

  useEffect(() => {
    const docs = state.documents.filter((doc) => doc.inTrash === null);
    setDocuments(docs);
  }, [state.documents]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex">
        <div className="w-[630px]">
          <CommandInput placeholder="Type a command or search..." />
          <div>
            <Tabs defaultValue="docs" className="">
              <TabsList className="w-full flex items-center justify-start bg-transparent">
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="collections">collections</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CommandSeparator />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {documents.map((doc) => (
                <CommandSearchItem
                  key={doc.id}
                  workspaceId={doc.workspaceId}
                  title={doc.title}
                  documentId={doc.id}
                  createdAt={new Date(doc.createdAt).toLocaleDateString()}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1">
          <div className="flex flex-col w-full p-2 float-start">
            <h4 className="text-sm p-2">Quick Filter</h4>
            <QuickFilterCombobox
              leftIcon={<User2 className="pr-2" />}
              text="Author"
              items={[]}
            />
            <QuickFilterCombobox
              leftIcon={<Target className="pr-2" />}
              text="Tags"
              items={[]}
            />
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 w-full justify-between"
            >
              <div className="flex items-center">
                <Archive className="pr-2" />
                Archived
              </div>
              <Switch />
            </Button>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
