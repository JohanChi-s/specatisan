"use client";
import { Chat } from "@/components/chat/components/chat";
import { AI } from "@/components/chat/lib/chat/actions";
import { nanoid } from "@/components/chat/lib/utils";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { cn } from "@/lib/utils";
import { memo, use, useCallback, useEffect } from "react";

function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"];
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "");
}

export const SidebarAI = memo(
  ({ isOpen, onClose }: { isOpen?: boolean; onClose: () => void }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose();
      }
    }, [onClose]);
    const { open, setOpen } = useSubscriptionModal();

    const id = nanoid();
    const missingKeys = getMissingKeys();
    const windowClassName = cn(
      "absolute top-0 right-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-[999] w-0 duration-300 transition-all",
      "dark:bg-black lg:dark:bg-black/30",
      !isOpen && "border-r-transparent hidden",
      isOpen && "w-96 border-l border-l-neutral-200 dark:border-l-neutral-800"
    );

    const { subscription } = useSupabaseUser();

    useEffect(() => {
      if (!subscription && isOpen) {
        setOpen(true);
        onClose();
        return;
      }
    });

    return (
      <div className={windowClassName}>
        <div className="w-full h-full overflow-hidden">
          <div className="w-full h-full p-6 overflow-auto">
            <Chat id={id} missingKeys={missingKeys} />
          </div>
        </div>
      </div>
    );
  }
);

SidebarAI.displayName = "chatai";
