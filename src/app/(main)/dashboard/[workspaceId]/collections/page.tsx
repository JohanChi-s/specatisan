"use client";

import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getCollectionByWorkspaceId } from "@/lib/supabase/queries";
import type { Collection } from "@/shared/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CollectionsPage: React.FC = () => {
  const { workspaceId } = useAppState();
  if (!workspaceId) redirect("/dashboard");
  const [collections, setCollections] = useState<Collection[] | []>([]);
  // get documents from the database with effect
  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await getCollectionByWorkspaceId(workspaceId);
      if (error) return;
      setCollections(data || []);
    };
    fetchCollections();
  });

  if (!workspaceId) redirect("/dashboard");
  return (
    <div className="container mx-auto py-10">
      <WorkspaceNavbar workspaceId={workspaceId} />
      {/* <DataTable columns={columns} data={documents} /> */}
    </div>
  );
};

export default CollectionsPage;
