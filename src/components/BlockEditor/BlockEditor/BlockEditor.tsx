"use client";

import { EditorContent } from "@tiptap/react";
import { useMemo, useRef } from "react";

import { LinkMenu } from "@/components/BlockEditor/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";

import "@/components/BlockEditor/styles/index.css";

import { Sidebar } from "@/components/BlockEditor/Sidebar";
import { EditorContext } from "@/components/BlockEditor/context/EditorContext";
import ImageBlockMenu from "@/components/BlockEditor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/components/BlockEditor/extensions/MultiColumn/menus";
import {
  TableColumnMenu,
  TableRowMenu,
} from "@/components/BlockEditor/extensions/Table/menus";
import { Loader } from "@/components/BlockEditor/ui/Loader";
import { useAIState } from "@/hooks/useAIState";
import { createPortal } from "react-dom";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { EditorHeader } from "./components/EditorHeader";
import { TiptapProps } from "./types";

export const BlockEditor = ({ aiToken, ydoc, provider, user }: TiptapProps) => {
  const aiState = useAIState();
  const menuContainerRef = useRef(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { editor, users, characterCount, collabState, leftSidebar } =
    useBlockEditor({
      aiToken,
      ydoc,
      provider,
      username: user?.email,
    });

  const displayedUsers = users.slice(0, 3);

  const providerValue = useMemo(() => {
    return {
      isAiLoading: aiState.isAiLoading,
      aiError: aiState.aiError,
      setIsAiLoading: aiState.setIsAiLoading,
      setAiError: aiState.setAiError,
    };
  }, [aiState]);

  if (!editor) {
    return null;
  }

  const aiLoaderPortal = createPortal(
    <Loader label="AI is now doing its job." />,
    document.body
  );

  return (
    <EditorContext.Provider value={providerValue}>
      <div className="flex h-full w-full" ref={menuContainerRef}>
        <Sidebar
          isOpen={leftSidebar.isOpen}
          onClose={leftSidebar.close}
          editor={editor}
        />
        <div className="relative flex flex-col flex-1 w-full h-full overflow-hidden">
          <EditorHeader
            characters={characterCount.characters()}
            collabState={collabState}
            users={displayedUsers}
            words={characterCount.words()}
            isSidebarOpen={leftSidebar.isOpen}
            toggleSidebar={leftSidebar.toggle}
          />
          <EditorContent
            editor={editor}
            ref={editorRef}
            className="flex-1 overflow-y-auto"
          />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
      {aiState.isAiLoading && aiLoaderPortal}
    </EditorContext.Provider>
  );
};

export default BlockEditor;
