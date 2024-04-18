"use client";
import { Menu, PackageIcon, StickyNote } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

interface MobileSidebarProps {
	children: React.ReactNode;
}

export const nativeNavigations = [
	{
		title: "Sidebar",
		id: "sidebar",
		customIcon: Menu,
	},
	{
		title: "Pages",
		id: "pages",
		customIcon: PackageIcon,
	},
] as const;

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
	const [selectedNav, setSelectedNav] = useState("");
	return (
		<>
			{selectedNav === "sidebar" && children}
			<nav
				className="bg-black/10
      backdrop-blur-lg
      sm:hidden 
      fixed 
      z-50 
      bottom-0 
      right-0 
      left-0
      "
			>
				<ul
					className="flex 
        justify-between 
        items-center 
        p-4"
				>
					{nativeNavigations.map((item) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<li
							className="flex
              items-center
              flex-col
              justify-center
            "
							key={item.id}
							onClick={() => {
								setSelectedNav(item.id);
							}}
						>
							<item.customIcon />
							<small
								className={clsx("", {
									"text-muted-foreground": selectedNav !== item.id,
								})}
							>
								{item.title}
							</small>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
};

export default MobileSidebar;
