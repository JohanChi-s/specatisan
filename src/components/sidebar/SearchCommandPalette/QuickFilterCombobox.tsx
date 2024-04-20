"use client";

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
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

interface Item {
	value: string;

	label: string;
}

interface QuickFilterComboboxProps {
	text?: string;

	leftIcon?: React.ReactNode;

	items: Item[];

	placeholderText?: string;

	onChange?: (value: string) => void;
}

export function QuickFilterCombobox({
	text = "Quick Filter",
	leftIcon,
	items = [],
	placeholderText = "Search...",
	onChange,
}: QuickFilterComboboxProps) {
	const [open, setOpen] = React.useState(false);

	const [value, setValue] = React.useState("");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className="w-full justify-between flex items-center"
					onClick={() => setOpen(!open)}
					aria-expanded={open}
					aria-haspopup="listbox"
				>
					<div className="flex items-center">
						{leftIcon}

						{value ? items.find((item) => item.value === value)?.label : text}
					</div>

					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[290px] p-0">
				<Command>
					<CommandInput placeholder={placeholderText} />
					<CommandList>
						<CommandEmpty>No item found.</CommandEmpty>
					</CommandList>

					<CommandGroup>
						{items.length > 0 &&
							items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);

										setOpen(false);

										if (onChange) onChange(currentValue);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",

											value === item.value ? "opacity-100" : "opacity-0",
										)}
									/>

									{item.label}
								</CommandItem>
							))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
