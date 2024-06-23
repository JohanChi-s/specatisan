"use client";

import { TiptapCollabProvider } from "@hocuspocus/provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Doc as YDoc } from "yjs";

import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import { LoadingEditor } from "@/components/Loading";
import { getDocumentDetails } from "@/lib/supabase/queries";
import { v4 } from "uuid";

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
  const searchParams = useSearchParams();
  const router = useRouter();

  const hasCollab = parseInt(searchParams?.get("noCollab") as string) !== 1;
  const user = {
    username: "anonymous",
    email: "anonymous",
  };

  const { documentId } = params;

  useEffect(() => {
    const checkRight = async () => {
      const document = await getDocumentDetails(documentId);
      if (!document.data?.template || !document.data) {
        return router.push("/documents/accessDeny");
      }
    };
    checkRight();
  }, [documentId]);

  useEffect(() => {
    // Fetch data
    const dataFetch = async () => {
      try {
        const response = await fetch("/api/collaboration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: v4(), // Replace with actual user data
            email: "anonymous", // Add any other relevant information
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
  }, []);

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

  if (hasCollab && (!collabToken || !provider)) return;
  return (
    <>
      <Suspense fallback={<LoadingEditor />}>
        <BlockEditor
          hasCollab={hasCollab}
          ydoc={ydoc}
          provider={provider}
          user={user}
        />
      </Suspense>
    </>
  );
}
