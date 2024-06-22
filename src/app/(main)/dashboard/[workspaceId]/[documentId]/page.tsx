"use client";

import { TiptapCollabProvider } from "@hocuspocus/provider";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Doc as YDoc } from "yjs";

import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { LoadingEditor } from "@/components/Loading";
import { getCollaborators } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";
import { User } from "@/lib/supabase/supabase.types";

export interface AiState {
  isAiLoading: boolean;
  aiError?: string | null;
}

export default function Document({
  params,
}: {
  params: { documentId: string };
}) {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [collabToken, setCollabToken] = useState<string | null>(null);
  const { workspaceId } = useAppState();
  const { user } = useSupabaseUser();
  const [workspaceCollabs, setWorkspaceColabs] = useState<string[]>([
    user?.email!,
  ]);
  const searchParams = useSearchParams();

  const hasCollab = parseInt(searchParams?.get("noCollab") as string) !== 1;

  const { documentId } = params;

  useEffect(() => {
    // Fetch data
    const dataFetch = async () => {
      try {
        if (!workspaceId) return;
        const data = await getCollaborators(workspaceId);
        const collabs: string[] = [];
        if (data) {
          data.map((user: User) => {
            collabs.push(user.email!);
          });
        } else {
          collabs.push(user?.email!);
        }
        // Set state when the data is received
        setWorkspaceColabs(collabs);
      } catch (error) {
        console.error("Error fetching workspace collaborators:", error);
      }
    };

    dataFetch();
  }, [user?.email, workspaceId]);

  useEffect(() => {
    // Fetch data
    const dataFetch = async () => {
      try {
        if (!user) return;
        const response = await fetch("/api/collaboration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id, // Replace with actual user data
            email: user.email, // Add any other relevant information
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        const { token } = data;

        // Set state when the data is received
        setCollabToken(token);
      } catch (error) {
        console.error("Error fetching collaboration token:", error);
      }
    };

    dataFetch();
  }, [user]);

  const ydoc = useMemo(() => new YDoc(), []);

  useLayoutEffect(() => {
    if (hasCollab && collabToken) {
      setProvider(
        new TiptapCollabProvider({
          name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${documentId}`,
          appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? "",
          token: collabToken,
          document: ydoc,
        })
      );
    }
  }, [setProvider, collabToken, ydoc, documentId, hasCollab]);

  if (hasCollab && (!collabToken || !provider || !user)) return;
  return (
    <>
      <Suspense fallback={<LoadingEditor />}>
        <BlockEditor
          // aiToken={aiToken}
          hasCollab={hasCollab}
          ydoc={ydoc}
          provider={provider}
          user={user}
          colabs={workspaceCollabs}
        />
      </Suspense>
    </>
  );
}
