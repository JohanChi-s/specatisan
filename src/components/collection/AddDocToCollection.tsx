"use client";
import { useAppState } from "@/lib/providers/state-provider";
import {
  getDocumentByWorkspaceId,
  updateDocument,
} from "@/lib/supabase/queries";
import { DocumentWithTags } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { columns } from "../files-table/column";
import { DataTable } from "../files-table/data-table";
import { toast } from "../ui/use-toast";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

type Props = {
  collectionId: string;
};

const AddDocToCollection: React.FC<Props> = ({ collectionId }) => {
  const [documents, setDocuments] = useState<DocumentWithTags[] | []>([]);
  const { workspaceId } = useAppState();

  const [rowSelection, setRowSelection] = useState({});

  const handleSave = async () => {
    console.log("collectionId", collectionId);

    if (!collectionId || !workspaceId) return;
    const docIds = Object.keys(rowSelection).map((key) => {
      if (key) return documents[parseInt(key)];
    });
    if (docIds.length === 0) return;
    // update document with collection id here
    const tasks = await Promise.all(
      docIds.map((doc) => {
        if (!doc) return;
        return updateDocument({ collectionId: collectionId }, doc?.id);
      })
    );
    tasks.forEach((task) => {
      if (task?.error) {
        toast({
          variant: "destructive",
          title: "Error adding document to collection",
        });
      }
    });
    toast({
      variant: "default",
      title: "Document added to collection",
    });
  };

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
  }, [workspaceId]);
  return (
    <div className="mt-2">
      <DataTable
        columns={columns}
        data={documents}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button onClick={() => handleSave()}>Confirm</Button>
      </DialogFooter>
    </div>
  );
};

export default AddDocToCollection;
