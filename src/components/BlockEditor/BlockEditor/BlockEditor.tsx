/* eslint-disable react-hooks/rules-of-hooks */
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
import { SidebarAI } from "../Sidebar/SidebarAI";
import { SidebarThread } from "../Sidebar/SidebarThread";
import { ThreadsProvider } from "../extensions/Comment/ThreadContext";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { TextMenu } from "../menus/TextMenu";
import { EditorHeader } from "./components/EditorHeader";
import { TiptapProps } from "./types";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";

export const BlockEditor = ({
  aiToken,
  ydoc,
  provider,
  user,
  colabs,
}: TiptapProps) => {
  const aiState = useAIState();
  const menuContainerRef = useRef(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const {
    editor,
    users,
    characterCount,
    collabState,
    leftSidebar,
    leftSidebarThread,
    leftSidebarAi,
    threads,
    selectThreadInEditor,
    createThread,
    deleteThread,
    onHoverThread,
    onLeaveThread,
    resolveThread,
    updateComment,
    unresolveThread,
  } = useBlockEditor({
    aiToken,
    ydoc,
    provider,
    user: user,
    colaborators: colabs,
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

  if (!editor || provider === null || provider === undefined) {
    return null;
  }

  const aiLoaderPortal = createPortal(
    <Loader label="AI is now doing its job." />,
    document.body
  );

  return (
    <EditorContext.Provider value={providerValue}>
      <ThreadsProvider
        onClickThread={selectThreadInEditor}
        onDeleteThread={deleteThread}
        onHoverThread={onHoverThread}
        onLeaveThread={onLeaveThread}
        onResolveThread={resolveThread}
        onUpdateComment={updateComment}
        onUnresolveThread={unresolveThread}
        selectedThreads={editor.storage.comments.focusedThreads}
        threads={threads}
      >
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
              isSidebarThreadOpen={leftSidebarThread.isOpen}
              toggleSidebarThread={leftSidebarThread.toggle}
              isSidebarAiOpen={leftSidebarAi.isOpen}
              toggleSidebarAi={leftSidebarAi.toggle}
            />
            <EditorContent
              id="editor-content"
              editor={editor}
              ref={editorRef}
              className="flex-1 overflow-y-auto"
            />
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} createThread={createThread} />
            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          </div>

          <SidebarThread
            isOpen={leftSidebarThread.isOpen}
            onClose={leftSidebarThread.close}
            user={user}
            provider={provider}
          />
          <SidebarAI
            isOpen={leftSidebarAi.isOpen}
            onClose={leftSidebarAi.close}
          />
        </div>
      </ThreadsProvider>
      {aiState.isAiLoading && aiLoaderPortal}
    </EditorContext.Provider>
  );
};

export default BlockEditor;
