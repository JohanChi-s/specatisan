import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import Settings from "../settings/settings";
import Trash from "../trash/trash";
import { HomeIcon, Settings2, Trash2 } from "lucide-react";

interface NativeNavigationProps {
	myWorkspaceId: string;
	className?: string;
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({
	myWorkspaceId,
	className,
}) => {
	return (
		<nav className={twMerge("my-2", className)}>
			<ul className="flex flex-col gap-2">
				<li>
					<Link
						className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
          "
						href={`/dashboard/${myWorkspaceId}`}
					>
						<HomeIcon size={24} />
						<span>My Workspace</span>
					</Link>
				</li>

				<Settings>
					<li
						className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
            cursor-pointer
          "
					>
						<Settings2 size={24} />
						<span>Settings</span>
					</li>
				</Settings>

				<Trash>
					<li
						className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
          "
					>
						<Trash2 size={24} />
						<span>Trash</span>
					</li>
				</Trash>
			</ul>
		</nav>
	);
};

export default NativeNavigation;
