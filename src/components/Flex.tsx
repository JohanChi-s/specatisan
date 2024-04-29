import { cn } from "@/lib/utils";
import React from "react";

interface FlexProps {
  auto?: boolean;
  column?: boolean;
  align?: string;
  justify?: string;
  wrap?: boolean;
  shrink?: boolean;
  reverse?: boolean;
  gap?: number;
  className?: string;
  children: React.ReactNode;
}

const Flex: React.FC<FlexProps> = ({
  auto,
  column,
  align,
  justify,
  wrap,
  shrink,
  reverse,
  gap,
  className,
  children,
}) => {
  const flexClasses = cn(
    "flex",
    auto && "flex-auto",
    column && (reverse ? "flex-col-reverse" : "flex-col"),
    !column && (reverse ? "flex-row-reverse" : "flex-row"),
    align && `items-${align}`,
    justify && `justify-${justify}`,
    wrap && "flex-wrap",
    shrink && "flex-shrink-0",
    gap && `gap-${gap}`,
    "min-h-0",
    "min-w-0",
    className
  );

  return <div className={flexClasses}>{children}</div>;
};

export default Flex;
