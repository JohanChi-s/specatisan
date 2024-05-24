import { PropsWithChildren } from "react";

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type Props = PropsWithChildren<{
  attributes: Record<string, string>;
  leaf: CustomText;
}>;

// Create inline Leaf components for Slate
export function Leaf({ attributes, children, leaf }: Props) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}
