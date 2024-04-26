import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
	CornerDownLeft,
	Dot,
	ExternalLink,
	FileText,
	Link2,
} from "lucide-react";
import React from "react";

const CommandSearchItem: React.FC = (props) => {
	return (
		<CommandItem className="flex items-center pt-0 pb-0 hover:cursor-pointer">
			<FileText className="h-4 w-4" />
			<div className="ml-2">
				<Label>This is a docsuments</Label>
				<div className="flex items-center text-xs text-teal-600">
					<span>Docs</span>
					<Dot />
					<span>7 days a go</span>
				</div>
			</div>
			<div className="flex items-center gap-x-2 ml-auto">
				<Button
					variant="default"
					className="text-sm bg-green-500 hover:bg-green-500"
					size="sm"
				>
					<CornerDownLeft className="h-4 w-4" />
				</Button>
				<Button variant="default" className="text-sm" size="sm">
					<ExternalLink className="h-4 w-4" />
				</Button>
				<Button variant="default" className="text-sm" size="sm">
					<Link2 className="h-4 w-4" />
				</Button>
			</div>
		</CommandItem>
	);
};

export default CommandSearchItem;
