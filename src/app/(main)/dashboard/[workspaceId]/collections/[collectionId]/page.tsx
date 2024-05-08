"use client";
import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import WorkspaceBreadcumb from "@/components/workspace/WorkspaceBreadcumb";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getDocumentByWorkspaceId } from "@/lib/supabase/queries";
import { Document } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const CollectionDetailPage = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [documents, setDocuments] = useState<Document[] | []>([]);
  const { workspaceId } = useAppState();

  useEffect(() => {
    if (!workspaceId) {
      redirect("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const { data, error } = await getDocumentByWorkspaceId(workspaceId);
        if (error) {
          return redirect("/dashboard");
        }
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchData();
  }, [workspaceId]);

  return (
    <div className="container mx-auto px-5">
      {/* Workspace Navbar */}
      <WorkspaceNavbar />

      {/* Workspace Breadcrumb (if needed) */}
      <WorkspaceBreadcumb />

      {/* Data Table */}
      <DataTable columns={columns} data={documents} />
    </div>
  );
  return <div>{params.collectionId}</div>;
};

export default CollectionDetailPage;
