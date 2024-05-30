"use client";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PopoverContent } from "../ui/popover";

import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { LogOut, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutButton from "../global/logout-button";
import ModeToggle from "../global/mode-toggle";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import Link from "next/link";
type Props = {};

const AccountInfo: React.FC = () => {
  const router = useRouter();
  const { user } = useSupabaseUser();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2" size="default">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-30">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem>
              <Link href={`/${user?.id}/settings/account`} className="flex">
                <Settings2 size={20} className="mr-2" />
                Account Settings
              </Link>
            </CommandItem>
            <CommandItem className="flex flex-1 items-center justify-between">
              <p>Togle mode</p>
              <ModeToggle />
            </CommandItem>
            <CommandSeparator />
            <CommandItem className="justify-center">
              <LogoutButton>
                <p className="flex items-center px-2">
                  Logout
                  <LogOut />
                </p>
              </LogoutButton>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default AccountInfo;
