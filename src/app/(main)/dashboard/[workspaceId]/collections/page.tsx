"use client";

import { collectionColumns } from "@/components/files-table/collection-column";
import { DataTable } from "@/components/files-table/data-table";
import { Separator } from "@/components/ui/separator";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getCollections } from "@/lib/supabase/queries";
import type { Collection } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CollectionsPage: React.FC = () => {
  const { workspaceId } = useAppState();
  if (!workspaceId) redirect("/dashboard");
  const [collections, setCollections] = useState<Collection[] | []>([]);
  // get collections from the database with effect
  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await getCollections(workspaceId);
      if (error) return;
      setCollections(data || []);
    };
    fetchCollections();
  }, [workspaceId]);

  if (!workspaceId) redirect("/dashboard");
  return (
    <div className="container mx-auto">
      <WorkspaceNavbar />
      <Separator className="my-2" />
      <DataTable columns={collectionColumns} data={collections} />
    </div>
  );
};

export default CollectionsPage;
