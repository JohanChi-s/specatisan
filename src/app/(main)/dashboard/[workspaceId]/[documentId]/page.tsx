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
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Doc as YDoc } from "yjs";

import { BlockEditor } from "@/components/BlockEditor/BlockEditor";
import { createPortal } from "react-dom";
import { Surface } from "@/components/BlockEditor/ui/Surface";
import { Toolbar } from "@/components/BlockEditor/ui/Toolbar";
import { Icon } from "@/components/BlockEditor/ui/Icon";

export interface AiState {
  isAiLoading: boolean;
  aiError?: string | null;
}

const useDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(
    () => setIsDarkMode((isDark) => !isDark),
    []
  );
  const lightMode = useCallback(() => setIsDarkMode(false), []);
  const darkMode = useCallback(() => setIsDarkMode(true), []);

  return {
    isDarkMode,
    toggleDarkMode,
    lightMode,
    darkMode,
  };
};

export default function Document({
  params,
}: {
  params: { documentId: string };
}) {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [collabToken, setCollabToken] = useState<string | null>(null);
  const [aiToken, setAiToken] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const hasCollab = parseInt(searchParams?.get("noCollab") as string) !== 1;

  const { documentId } = params;

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch("/api/collaboration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();

      const { token } = data;
      console.log("🚀 ~ dataFetch ~ token:", token);

      // set state when the data received
      setCollabToken(token);
    };

    dataFetch();
  }, []);

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

  if (hasCollab && (!collabToken || !provider)) return;
  return (
    <>
      <BlockEditor
        // aiToken={aiToken}
        hasCollab={hasCollab}
        ydoc={ydoc}
        provider={provider}
      />
    </>
  );
}
