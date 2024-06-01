import { useEffect, useMemo, useState } from "react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";
import { Editor, ReactRenderer, useEditor } from "@tiptap/react";
// import Ai from "@tiptap-pro/extension-ai";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Mention from "@tiptap/extension-mention";
import type { Doc as YDoc } from "yjs";

import { EditorUser } from "@/components/BlockEditor/BlockEditor/types";
import { ExtensionKit } from "@/components/BlockEditor/extensions/extension-kit";
import { userColors } from "@/lib/BlockEditor/constants";
import { initialContent } from "@/lib/BlockEditor/data/initialContent";
import { randomElement } from "@/lib/BlockEditor/utils";
import { useSidebar } from "./useSidebar";
import MentionList, {
  MentionListRef,
} from "@/components/BlockEditor/extensions/Mention/MentionList";
declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  aiToken,
  ydoc,
  provider,
  username,
  colaborators,
}: {
  aiToken?: string;
  ydoc: YDoc;
  provider?: TiptapCollabProvider | null | undefined;
  username?: string;
  colaborators?: string[];
}) => {
  const leftSidebar = useSidebar();
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
            name: username,
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

  return { editor, users, characterCount, collabState, leftSidebar };
};
