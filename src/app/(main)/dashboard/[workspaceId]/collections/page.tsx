"use client";

import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getAllFiles } from "@/lib/supabase/queries";
import type { File } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CollectionsPage: React.FC = () => {
  const { workspaceId } = useAppState();
  const [files, setFiles] = useState<File[] | []>([]);
  // get files from the database with effect
  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await getAllFiles();
      if (error) return;
      setFiles(data);
    };
    fetchFiles();
  });

  if (!workspaceId) redirect("/dashboard");
  return (
    <div className="container mx-auto py-10">
      <WorkspaceNavbar workspaceId={workspaceId} />
      <DataTable columns={columns} data={files} />
    </div>
  );
};

export default CollectionsPage;
