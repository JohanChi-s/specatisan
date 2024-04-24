"use client";

import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getWorkspaceFolders, getAllFiles } from "@/lib/supabase/queries";
import type { File, Folder } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CollectionsPage: React.FC = () => {
  const { workspaceId } = useAppState();
  const [collections, setCollections] = useState<Folder[] | []>([]);
  if (!workspaceId) redirect("/dashboard");
  // get collections from the database with effect
  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await getWorkspaceFolders(workspaceId);
      if (error) return;
      setCollections(data);
    };
    fetchCollections();
  });

  if (!workspaceId) redirect("/dashboard");
  return (
    <div className="container mx-auto py-10">
      <WorkspaceNavbar workspaceId={workspaceId} />
      <DataTable columns={columns} data={collections} />
    </div>
  );
};

export default CollectionsPage;
