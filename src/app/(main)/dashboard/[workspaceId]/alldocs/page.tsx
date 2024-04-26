"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAppState } from "@/lib/providers/state-provider";
import { getDocumentByWorkspaceId } from "@/lib/supabase/queries";
import WorkspaceBreadcumb from "@/components/workspace/WorkspaceBreadcumb";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { DataTable } from "@/components/files-table/data-table";
import { columns } from "@/components/files-table/column";
import type { Document } from "@/lib/supabase/supabase.types";

const AllDocsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
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
          redirect("/dashboard");
          return;
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
      <WorkspaceNavbar workspaceId={workspaceId} />

      {/* Workspace Breadcrumb (if needed) */}
      <WorkspaceBreadcumb />

      {/* Data Table */}
      <DataTable columns={columns} data={documents} />
    </div>
  );
};

export default AllDocsPage;
