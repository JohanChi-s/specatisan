"use client";
import { DataTable } from "@/components/files-table/data-table";
import { trashColumns } from "@/components/files-table/trash-column";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getDocumentsIntrash } from "@/lib/supabase/queries";
import type { Document } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const TrashPage = () => {
  const { state, workspaceId } = useAppState();
  const [documents, setDocuments] = useState<Document[] | []>([]);

  useEffect(() => {
    if (!workspaceId) {
      redirect("/dashboard");
      return;
    }
    const fetchData = async () => {
      try {
        const { data, error } = await getDocumentsIntrash(workspaceId);
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
  }, [state, workspaceId]);

  return (
    <div className="flex flex-col w-full h-full">
      <WorkspaceNavbar workspaceId={workspaceId} />
      <DataTable columns={trashColumns} data={documents} />
    </div>
  );
};

export default TrashPage;
