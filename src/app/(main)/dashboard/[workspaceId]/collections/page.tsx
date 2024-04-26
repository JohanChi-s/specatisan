"use client";

import { collectionColumns } from "@/components/files-table/collection-column";
import { DataTable } from "@/components/files-table/data-table";
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
  });

  if (!workspaceId) redirect("/dashboard");
  return (
    <div className="container mx-auto py-10">
      <WorkspaceNavbar workspaceId={workspaceId} />
      <DataTable columns={collectionColumns} data={collections} />
    </div>
  );
};

export default CollectionsPage;
