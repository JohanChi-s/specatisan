import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";
import { ThreadsList } from "../extensions/Comment/ThreadList";

export const SidebarThread = memo(
  ({
    provider,
    isOpen,
    user,
    onClose,
  }: {
    provider: any;
    isOpen?: boolean;
    user: any;
    onClose: () => void;
  }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose]);

    const windowClassName = cn(
      "absolute top-0 right-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-[999] w-0 duration-300 transition-all",
      "dark:bg-black lg:dark:bg-black/30",
      !isOpen && "border-r-transparent",
      isOpen && "w-80 border-l border-l-neutral-200 dark:border-l-neutral-800"
    );

    return (
      <div className={windowClassName}>
        <div className="w-full h-full overflow-hidden">
          <div className="w-full h-full p-6 overflow-auto">
            <ThreadsList provider={provider} user={user} />
          </div>
        </div>
      </div>
    );
  }
);

SidebarThread.displayName = "TableOfContentSidepanel";
