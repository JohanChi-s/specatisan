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
import CommandSearchItem from "./CommandItem";
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

export function CommandMenu() {
	const [isOpen, setIsOpen] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen(!isOpen);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
			<div className="flex">
				<div className="w-[630px]">
					<CommandInput placeholder="Type a command or search..." />
					<div>
						<Tabs defaultValue="account" className="">
							<TabsList className="w-full flex items-center justify-start bg-transparent">
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="tasks">Tasks</TabsTrigger>
								<TabsTrigger value="docs">Docs</TabsTrigger>
								<TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
								<TabsTrigger value="files">Files</TabsTrigger>
								<TabsTrigger value="people">People</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<CommandSeparator />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandSearchItem />
							<CommandSearchItem />
							<CommandSearchItem />
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
						<h4 className="text-sm p-2">Location Filter</h4>
						<Button variant="ghost" size="sm" className="w-full justify-start">
							Current Location
						</Button>
						<QuickFilterCombobox text="+ Add Location" items={[]} />
					</div>
					<div className="flex flex-col w-full p-2 float-start">
						<h4 className="text-sm p-2">Quick Filter</h4>
						<QuickFilterCombobox
							leftIcon={<Users className="pr-2" />}
							text="Assigned To"
							items={[]}
						/>
						<QuickFilterCombobox
							leftIcon={<User2 className="pr-2" />}
							text="Author"
							items={[]}
						/>
						<QuickFilterCombobox
							leftIcon={<Target className="pr-2" />}
							text="Status"
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
