"use client";
import { Key, Slash } from "lucide-react";
import type React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface WorkspaceBreadcumbProps {
  items?: BreadcrumbItem[];
}

export const defaultBreadcumbItems = [{ href: "/", label: "Home" }];

const WorkspaceBreadcumb: React.FC<WorkspaceBreadcumbProps> = ({
  items = defaultBreadcumbItems,
}) => {
  return (
    <Breadcrumb className="pt-4 pl-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={item.label} className="flex">
            {index === 0 ? null : <BreadcrumbSeparator className="text-2xl" />}
            <BreadcrumbItem className="text-2xl">
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default WorkspaceBreadcumb;
