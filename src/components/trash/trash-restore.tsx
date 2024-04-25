"use client";
import {
  appCollectionsType,
  useAppState,
} from "@/lib/providers/state-provider";
import { Document } from "@/shared/supabase.types";
import { FileIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TrashRestore = () => {
  const { state, workspaceId } = useAppState();
  const [collections, setCollections] = useState<appCollectionsType[] | []>([]);
  const [documents, setDocuments] = useState<Document[] | []>([]);

  useEffect(() => {
    const stateCollections =
      state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.filter((collection) => collection.inTrash) || [];
    setCollections(stateCollections);

    let stateDocuments: Document[] = [];
    state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.collections.forEach((collection) => {
        collection.documents.forEach((document) => {
          if (document.inTrash) {
            stateDocuments.push(document);
          }
        });
      });
    setDocuments(stateDocuments);
  }, [state, workspaceId]);

  return (
    <section>
      {!!collections.length && (
        <>
          <h3>Collections</h3>
          {collections.map((collection) => (
            <Link
              className="hover:bg-muted
            rounded-md
            p-2
            flex
            item-center
            justify-between"
              href={`/dashboard/${collection.workspaceId}/${collection.id}`}
              key={collection.id}
            >
              <article>
                <aside className="flex items-center gap-2">
                  <FolderIcon />
                  {collection.name}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}
      {!!documents.length && (
        <>
          <h3>Documents</h3>
          {documents.map((document) => (
            <Link
              key={document.id}
              className=" hover:bg-muted rounded-md p-2 flex items-center justify-between"
              href={`/dashboard/${document.workspaceId}/${document.collectionId}/${document.id}`}
            >
              <article>
                <aside className="flex items-center gap-2">
                  <FileIcon />
                  {document.title}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}
      {!documents.length && !collections.length && (
        <div
          className="
          text-muted-foreground
          absolute
          top-[50%]
          left-[50%]
          transform
          -translate-x-1/2
          -translate-y-1/2

      "
        >
          No Items in trash
        </div>
      )}
    </section>
  );
};

export default TrashRestore;
