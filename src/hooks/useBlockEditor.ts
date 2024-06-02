import { Editor, ReactRenderer, useEditor } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { useCallback, useEffect, useMemo, useState } from "react";
import tippy, { Instance } from "tippy.js";
// import Ai from "@tiptap-pro/extension-ai";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import { CommentsKit } from "@tiptap-pro/extension-comments";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Mention from "@tiptap/extension-mention";
import type { Doc as YDoc } from "yjs";

import { EditorUser } from "@/components/BlockEditor/BlockEditor/types";
import { useThreads } from "@/components/BlockEditor/extensions/Comment/useThreads";
import MentionList, {
  MentionListRef,
} from "@/components/BlockEditor/extensions/Mention/MentionList";
import { ExtensionKit } from "@/components/BlockEditor/extensions/extension-kit";
import { userColors } from "@/lib/BlockEditor/constants";
import { initialContent } from "@/lib/BlockEditor/data/initialContent";
import { randomElement } from "@/lib/BlockEditor/utils";
import { useSidebar } from "./useSidebar";
declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  aiToken,
  ydoc,
  provider,
  user,
  colaborators,
}: {
  aiToken?: string;
  ydoc: YDoc;
  provider?: TiptapCollabProvider | null | undefined;
  user?: any;
  colaborators?: string[];
}) => {
  const leftSidebar = useSidebar();
  const leftSidebarThread = useSidebar();
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    WebSocketStatus.Connecting
  );
  // const { setIsAiLoading, setAiError } = useContext(EditorContext)

  const editor = useEditor(
    {
      autofocus: true,
      onCreate: ({ editor }) => {
        provider?.on("synced", () => {
          if (editor.isEmpty) {
            editor.commands.setContent(initialContent);
          }
        });
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: user?.email || "Anonymous",
            color: randomElement(userColors),
          },
        }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention border round-sm py-1 px-2",
          },
          suggestion: {
            items: ({ query }) => {
              if (colaborators?.length) {
                return (
                  colaborators?.filter((colab) =>
                    colab.toLowerCase().includes(query.toLowerCase())
                  ) || []
                );
              }
              return [];
            },
            render: () => {
              let component: ReactRenderer<MentionListRef> | undefined;
              let popup: Instance[] | undefined;

              return {
                onStart: (props: SuggestionProps) => {
                  component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                  });

                  if (!props.clientRect) {
                    return;
                  }

                  popup = tippy("body", {
                    getReferenceClientRect: props.clientRect as any,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                  });
                },

                onUpdate(props: SuggestionProps) {
                  component?.updateProps(props);

                  if (!props.clientRect) {
                    return;
                  }

                  popup?.[0]?.setProps({
                    getReferenceClientRect: props.clientRect as any,
                  });
                },

                onKeyDown(props: { event: KeyboardEvent }) {
                  if (props.event.key === "Escape") {
                    popup?.[0]?.hide();
                    return true;
                  }

                  return component?.ref?.onKeyDown(props) || false;
                },

                onExit() {
                  popup?.[0]?.destroy();
                  component?.destroy();
                },
              };
            },
          },
        }),

        CommentsKit.configure({
          provider: provider,
        }),
      ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    [ydoc, provider]
  );
  const { threads, createThread, removeThread } = useThreads(
    provider,
    editor,
    user
  );

  const selectThreadInEditor = useCallback(
    (threadId: string) => {
      editor?.chain().selectThread({ id: threadId }).run();
    },
    [editor]
  );

  const deleteThread = useCallback(
    (threadId: string) => {
      provider?.deleteThread(threadId);
      editor?.commands.removeThread({ id: threadId });
    },
    [editor?.commands, provider]
  );

  const resolveThread = useCallback(
    (threadId: string) => {
      editor?.commands.resolveThread({ id: threadId });
    },
    [editor]
  );

  const unresolveThread = useCallback(
    (threadId: string) => {
      editor?.commands.unresolveThread({ id: threadId });
    },
    [editor]
  );

  const updateComment = useCallback(
    (threadId: string, commentId: string, content: any, metaData: any) => {
      editor?.commands.updateComment({
        threadId,
        id: commentId,
        content,
        data: metaData,
      });
    },
    [editor]
  );

  const onHoverThread = useCallback(
    (threadId: string) => {
      const { tr } = editor?.state!;

      tr.setMeta("threadMouseOver", threadId);
      editor?.view.dispatch(tr);
    },
    [editor]
  );

  const onLeaveThread = useCallback(
    (threadId: string) => {
      const { tr } = editor?.state!;

      tr.setMeta("threadMouseOut", threadId);
      editor?.view.dispatch(tr);
    },
    [editor]
  );

  const users = useMemo(() => {
    if (!editor?.storage.collaborationCursor?.users) {
      return [];
    }

    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name?.split(" ");
      const firstName = names?.[0];
      const lastName = names?.[names.length - 1];
      const initials = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`;

      return { ...user, initials: initials.length ? initials : "?" };
    });
  }, [editor?.storage.collaborationCursor?.users]);

  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  useEffect(() => {
    provider?.on("status", (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);

  window.editor = editor;

  return {
    editor,
    users,
    characterCount,
    collabState,
    leftSidebar,
    leftSidebarThread,
    threads,
    selectThreadInEditor,
    createThread,
    deleteThread,
    onHoverThread,
    onLeaveThread,
    resolveThread,
    updateComment,
    unresolveThread,
  };
};
