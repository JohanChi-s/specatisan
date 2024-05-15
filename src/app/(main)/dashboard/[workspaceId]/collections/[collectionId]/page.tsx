"use client";
import AddDocToCollection from "@/components/collection/AddDocToCollection";
import { columns } from "@/components/files-table/column";
import { DataTable } from "@/components/files-table/data-table";
import CustomDialogTrigger from "@/components/global/custom-dialog-trigger";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import WorkspaceBreadcumb from "@/components/workspace/WorkspaceBreadcumb";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { getDocumentsByCollectionId } from "@/lib/supabase/queries";
import { DocumentWithTags } from "@/lib/supabase/supabase.types";
import { PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const CollectionDetailPage = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [documents, setDocuments] = useState<DocumentWithTags[] | []>([]);
  const { workspaceId } = useAppState();
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (!workspaceId || !params.collectionId) {
      return redirect("/dashboard");
    }

    const fetchData = async () => {
      try {
        var { data, error } = await getDocumentsByCollectionId(
          params.collectionId
        );
        console.log("🚀 ~ fetchData ~ data:", data);
        if (error) {
          toast({
            variant: "destructive",
            title: "Error fetching documents",
          });
        }
        data = data?.filter((doc: DocumentWithTags) => doc.inTrash === null);
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          variant: "destructive",
          title: "Error fetching documents",
        });
      }
    };

    fetchData();
  }, [params.collectionId, workspaceId]);

  return (
    <div className="container mx-auto px-5">
      {/* Workspace Navbar */}
      <WorkspaceNavbar />

      {/* Workspace Breadcrumb (if needed) */}
      <WorkspaceBreadcumb items={[]} />

      <CustomDialogTrigger
        content={<AddDocToCollection collectionId={params.collectionId} />}
        header="Add Doc To Collection"
        description="Select a document to add to this collection."
      >
        <Button variant={"default"} size={"default"} className="my-2">
          <PlusCircle className="mr-1" /> Add Doc
        </Button>
      </CustomDialogTrigger>

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

export default CollectionDetailPage;
