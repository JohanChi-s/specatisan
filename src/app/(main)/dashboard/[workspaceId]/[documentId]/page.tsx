// export const dynamic = "force-dynamic";

// import MainEditor from "@/components/editor/Editor";
// import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
// import { getDocumentDetails } from "@/lib/supabase/queries";
// import { redirect } from "next/navigation";

// export default async function DocumentDetailPage({
//   params,
// }: {
//   params: { documentId: string };
// }) {
//   const { data, error } = await getDocumentDetails(params.documentId);
//   if (error || data?.id === undefined) {
//     redirect("/dashboard");
//   }
//   return (
//     <div className="max-w-[1336px] w-full rounded-lg border bg-background shadow over">
//       <WorkspaceNavbar
//         documentId={data?.id}
//         title={data.title}
//         isShowTabs={false}
//       />

//       {/* <MainEditor documentId={data?.id} /> */}
//     </div>
//   );
// }

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
  const [aiToken, setAiToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { user } = useSupabaseUser();

  const hasCollab = parseInt(searchParams?.get("noCollab") as string) !== 1;

  const { documentId } = params;

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
        console.log("response.ok", response);

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

  // useEffect(() => {
  //   // fetch data
  //   const dataFetch = async () => {
  //     const data = await (
  //       await fetch("/api/ai", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //     ).json();

  //     const { token } = data;

  //     // set state when the data received
  //     setAiToken(token);
  //   };

  //   dataFetch();
  // }, []);

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
        />
      </Suspense>
    </>
  );
}
