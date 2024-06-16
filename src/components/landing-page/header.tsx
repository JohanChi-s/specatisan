"use client";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [path, setPath] = useState("#products");
  return (
    <header
      className="p-4
      flex
      justify-center
      items-center
  "
    >
      <Link
        href={"/"}
        className="w-full flex gap-2
        justify-left items-center"
      >
        <span
          className="font-semibold
          dark:text-white
        "
        >
          specatisan.
        </span>
      </Link>
      <aside
        className="flex
        w-full
        gap-2
        justify-end
      "
      >
        <Link href={"/auth/login"}>
          <Button variant={"secondary"} className="hidden sm:block">
            Login
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button className="whitespace-nowrap">Sign Up</Button>
        </Link>
      </aside>
    </header>
  );
};

export default Header;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group block select-none space-y-1 font-medium leading-none"
          )}
          {...props}
        >
          <div className="text-white text-sm font-medium leading-none">
            {title}
          </div>
          <p
            className="group-hover:text-white/70
            line-clamp-2
            text-sm
            leading-snug
            text-white/40
          "
          >
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
