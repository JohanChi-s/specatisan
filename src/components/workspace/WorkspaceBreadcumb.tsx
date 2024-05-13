"use client";
import { Key, Slash } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export interface BreadcrumbItemProps {
  href: string;
  label: string;
}

interface WorkspaceBreadcumbProps {
  items?: BreadcrumbItemProps[];
}

export const defaultBreadcumbItems = [];

const WorkspaceBreadcumb: React.FC<WorkspaceBreadcumbProps> = ({
  items = defaultBreadcumbItems,
}) => {
  return (
    <Breadcrumb className="flex items-center">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={item.label} className="flex">
            {index === 0 ? null : <BreadcrumbSeparator className="text-base" />}
            <BreadcrumbItem className="text-base">
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default WorkspaceBreadcumb;
