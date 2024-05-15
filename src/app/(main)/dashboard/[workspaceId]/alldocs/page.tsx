"use client";
import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getDocumentByWorkspaceId } from "@/lib/supabase/queries";
import type { Document, DocumentWithTags } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const AllDocsPage = () => {
  const [documents, setDocuments] = useState<DocumentWithTags[]>([]);
  const { workspaceId } = useAppState();
  const { state } = useAppState();

  useEffect(() => {
    if (!workspaceId) {
      return redirect("/dashboard");
    }

    const fetchData = async () => {
      try {
        var { data, error } = await getDocumentByWorkspaceId(workspaceId);
        if (error) {
          return redirect("/dashboard");
        }
        if (data) {
          data = data.filter((doc) => doc.inTrash === null);
        }
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    const docs = state.documents.filter((doc) => doc.inTrash === null);
    setDocuments(docs);
  }, [state.documents]);
  const [rowSelection, setRowSelection] = useState({});

  return (
    <div className="container mx-auto px-5">
      {/* Workspace Navbar */}
      <WorkspaceNavbar />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={documents}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};

export default AllDocsPage;
