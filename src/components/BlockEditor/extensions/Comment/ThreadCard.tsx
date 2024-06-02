import React, { useCallback, useEffect, useRef, ReactNode } from "react";
import { clsx } from "clsx";

interface ThreadCardProps {
  id: string;
  active: boolean;
  children: ReactNode;
  onClick?: (id: string) => void;
  onClickOutside?: () => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  active,
  children,
  onClick,
  onClickOutside,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(id);
    }
  }, [id, onClick]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const clickHandler = (event: MouseEvent) => {
      if (!cardRef.current) {
        return;
      }

      if (!cardRef.current.contains(event.target as Node)) {
        if (onClickOutside) {
          onClickOutside();
        }
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [active, onClickOutside]);

  const classNames = clsx(
    "appearance-none rounded border-2 block p-2 transition-all text-left",
    active
      ? "cursor-default border-neutral-500"
      : "cursor-pointer border-neutral-200 hover:border-neutral-500"
  );

  return (
    <div ref={cardRef} className={classNames} onClick={handleClick}>
      {children}
    </div>
  );
};
