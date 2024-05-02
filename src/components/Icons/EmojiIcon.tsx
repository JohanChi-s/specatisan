import * as React from "react";

type Props = {
  emoji: string;
  size?: number;
};
export default function EmojiIcon({ size = 24, emoji, ...rest }: Props) {
  return (
    <div
      className={`inline-flex items-center justify-center text-center flex-shrink-0 w-${size} h-${size} text-${
        size - 10
      }`}
    >
      {emoji}
    </div>
  );
}
