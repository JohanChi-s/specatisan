import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useAppState } from "../providers/state-provider";

import { Document } from "../../shared/supabase.types";
import { useRouter } from "next/navigation";

const useSupabaseRealtime = () => {
  const supabase = createClientComponentClient();
  const { dispatch, state, workspaceId: selectedWorskpace } = useAppState();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("🟢 RECEIVED REAL TIME EVENT");
            const {
              collection_id: collectionId,
              workspace_id: workspaceId,
              id: documentId,
            } = payload.new;
            if (
              !state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.collections.find(
                  (collection) => collection.id === collectionId
                )
                ?.documents.find((document) => document.id === documentId)
            ) {
              const newDocument: Document = {
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                collectionId: payload.new.collection_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTrash: payload.new.in_trash,
                bannerUrl: payload.new.banner_url,
              };
              dispatch({
                type: "ADD_DOCUMENT",
                payload: { document: newDocument, collectionId, workspaceId },
              });
            }
          } else if (payload.eventType === "DELETE") {
            let workspaceId = "";
            let collectionId = "";
            const documentExists = state.workspaces.some((workspace) =>
              workspace.collections.some((collection) =>
                collection.documents.some((document) => {
                  if (document.id === payload.old.id) {
                    workspaceId = workspace.id;
                    collectionId = collection.id;
                    return true;
                  }
                })
              )
            );
            if (documentExists && workspaceId && collectionId) {
              router.replace(`/dashboard/${workspaceId}`);
              dispatch({
                type: "DELETE_DOCUMENT",
                payload: {
                  documentId: payload.old.id,
                  collectionId,
                  workspaceId,
                },
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const { collection_id: collectionId, workspace_id: workspaceId } =
              payload.new;
            state.workspaces.some((workspace) =>
              workspace.collections.some((collection) =>
                collection.documents.some((document) => {
                  if (document.id === payload.new.id) {
                    dispatch({
                      type: "UPDATE_DOCUMENT",
                      payload: {
                        workspaceId,
                        collectionId,
                        documentId: payload.new.id,
                        document: {
                          title: payload.new.title,
                          iconId: payload.new.icon_id,
                          inTrash: payload.new.in_trash,
                        },
                      },
                    });
                    return true;
                  }
                })
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, state, selectedWorskpace]);

  return null;
};

export default useSupabaseRealtime;
