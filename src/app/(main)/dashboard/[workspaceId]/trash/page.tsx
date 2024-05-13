"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import {
  deleteCollection,
  deleteDocument,
  getDocumentByWorkspaceId,
  updateCollection,
  updateDocument,
} from "@/lib/supabase/queries";
import type { Document, Collection } from "@/lib/supabase/supabase.types";
import { ArchiveRestore, Delete, FolderIcon, InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

const TrashPage = () => {
  const { state, workspaceId, dispatch } = useAppState();
  const [collections, setCollections] = useState<Collection[] | []>([]);
  const [documents, setDocuments] = useState<Document[] | []>([]);

  useEffect(() => {
    const workspace = state.workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      const collectionsInTrash =
        workspace?.collections?.filter((w) => w.inTrash !== null) || [];
      setCollections(collectionsInTrash);
    }
  }, [state.workspaces, workspaceId]);

  // fetch documents in trash
  useEffect(() => {
    const fetchDocsInTrash = async () => {
      if (!workspaceId) return console.error("No workspaceId");
      const { data, error } = await getDocumentByWorkspaceId(workspaceId);
      if (error) {
        console.error("Error fetching documents in trash", error);
      } else {
        const docsInTrash = data?.filter((d) => d.inTrash !== null) || [];
        setDocuments(docsInTrash || []);
      }
    };
    fetchDocsInTrash();
  }, [state.workspaces, workspaceId]);

  const handleRestoreCollection = async (collectionId: string) => {
    if (!workspaceId) return console.error("No workspaceId");
    const { error } = await updateCollection({ inTrash: null }, collectionId);
    if (error) {
      console.error("Error restoring collection", error);
      toast({
        variant: "destructive",
        title: "Error! Could not restore collection",
      });
    } else {
      const updatedCollections = collections.filter(
        (c) => c.id !== collectionId
      );
      setCollections(updatedCollections);
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          workspaceId,
          collection: { id: collectionId, inTrash: null },
          collectionId,
        },
      });
      toast({
        variant: "default",
        title: "Collection restored successfully",
      });
    }
  };
  const handleDeleteCollection = async (collectionId: string) => {
    // delete collection permanently
    if (!workspaceId) return console.error("No workspaceId");
    const { error } = await deleteCollection(collectionId);
    if (error) {
      console.error("Error deleting collection permanently", error);
      toast({
        variant: "destructive",
        title: "Error! Could not delete collection",
      });
    } else {
      const updatedCollections = collections.filter(
        (c) => c.id !== collectionId
      );
      setCollections(updatedCollections);
      dispatch({
        type: "DELETE_FOLDER",
        payload: { workspaceId, collectionId },
      });
      toast({ variant: "default", title: "Collection deleted permanently" });
    }
  };
  const handleRestoreDocument = async (documentId: string) => {
    // restore document
    if (!workspaceId) return console.error("No workspaceId");
    const { error } = await updateDocument({ inTrash: null }, documentId);
    if (error) {
      console.error("Error restoring document", error);
      toast({
        variant: "destructive",
        title: "Error! Could not restore document",
      });
    } else {
      const updatedDocuments = documents.filter((d) => d.id !== documentId);
      setDocuments(updatedDocuments);
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          workspaceId,
          document: { id: documentId, inTrash: null },
          fileId: documentId,
        },
      });
      toast({ variant: "default", title: "Document restored successfully" });
    }
  };
  const handleDeleteDocument = async (documentId: string) => {
    // delete document permanently
    if (!workspaceId) return console.error("No workspaceId");
    const { error } = await deleteDocument(documentId);
    if (error) {
      console.error("Error deleting document permanently", error);
      toast({
        variant: "destructive",
        title: "Error! Could not delete document",
      });
    } else {
      const updatedDocuments = documents.filter((d) => d.id !== documentId);
      setDocuments(updatedDocuments);
      toast({ variant: "default", title: "Document deleted permanently" });
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <WorkspaceNavbar
        isShowTabs={false}
        items={[{ href: "/trash", label: "Trash" }]}
      />
      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="ml-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
        <TabsContent value="collections">
          {collections.length === 0 ? (
            <div className="flex flex-1 items-center justify-center w-full h-full">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No collections in trash
              </p>
            </div>
          ) : (
            <ul className="flex flex-col flex-1 w-full px-4">
              {collections.map((collection) => (
                <li
                  key={collection.id}
                  className="flex w-full items-center justify-between border-b border-gray-200 dark:border-gray-700 border-t"
                >
                  <div className="flex items-center gap-2 p-2">
                    <FolderIcon size={18} />
                    <h3 className="text-lg">{collection.name}</h3>
                  </div>
                  <div className="">
                    <Button
                      size={"sm"}
                      onClick={() => handleRestoreCollection(collection.id)}
                      variant={"default"}
                    >
                      <ArchiveRestore size={18} />
                    </Button>
                    <Button
                      size={"sm"}
                      className="mx-2"
                      onClick={() => handleDeleteCollection(collection.id)}
                      variant={"destructive"}
                    >
                      <Delete size={18} />
                    </Button>
                    <Button size={"sm"} onClick={() => {}} variant={"outline"}>
                      <InfoIcon size={18} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="docs">
          {documents.length === 0 ? (
            <div className="flex flex-1 items-center justify-center w-full h-full">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No documents in trash
              </p>
            </div>
          ) : (
            <ul className="flex flex-col flex-1 w-full px-4">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className="flex w-full items-center justify-between border-b border-gray-200 dark:border-gray-700 border-t"
                >
                  <div className="flex items-center gap-2 p-2">
                    <FolderIcon size={18} />
                    <h3 className="text-lg">{document.title}</h3>
                  </div>
                  <div className="">
                    <Button size={"sm"} onClick={() => {}} variant={"default"}>
                      <ArchiveRestore size={18} />
                    </Button>
                    <Button
                      size={"sm"}
                      className="mx-2"
                      onClick={() => handleDeleteDocument(document.id)}
                      variant={"destructive"}
                    >
                      <Delete size={18} />
                    </Button>
                    <Button size={"sm"} onClick={() => {}} variant={"outline"}>
                      <InfoIcon size={18} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
      {/* Content: table, has restore and delete permanent button */}
    </div>
  );
};

export default TrashPage;
