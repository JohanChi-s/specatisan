"use client";

import { CommentsProvider } from "@/lib/plate/comments/CommentsProvider";
import { createPlateUI } from "@/lib/plate/create-plate-ui";
import { editableProps } from "@/lib/plate/editableProps";
import { isEnabled } from "@/lib/plate/is-enabled";
import { alignPlugin } from "@/lib/plate/plugins/alignPlugin";
import { autoformatIndentLists } from "@/lib/plate/plugins/autoformatIndentLists";
import { autoformatLists } from "@/lib/plate/plugins/autoformatLists";
import { autoformatRules } from "@/lib/plate/plugins/autoformatRules";
import { dragOverCursorPlugin } from "@/lib/plate/plugins/dragOverCursorPlugin";
import { emojiPlugin } from "@/lib/plate/plugins/emojiPlugin";
import { exitBreakPlugin } from "@/lib/plate/plugins/exitBreakPlugin";
import { forcedLayoutPlugin } from "@/lib/plate/plugins/forcedLayoutPlugin";
import { lineHeightPlugin } from "@/lib/plate/plugins/lineHeightPlugin";
import { linkPlugin } from "@/lib/plate/plugins/linkPlugin";
import { resetBlockTypePlugin } from "@/lib/plate/plugins/resetBlockTypePlugin";
import { selectOnBackspacePlugin } from "@/lib/plate/plugins/selectOnBackspacePlugin";
import { softBreakPlugin } from "@/lib/plate/plugins/softBreakPlugin";
import { tabbablePlugin } from "@/lib/plate/plugins/tabbablePlugin";
import { trailingBlockPlugin } from "@/lib/plate/plugins/trailingBlockPlugin";
import { MENTIONABLES } from "@/lib/plate/values/mentionables";
import { cn } from "@udecode/cn";
import { createAlignPlugin } from "@udecode/plate-alignment";
import { createAutoformatPlugin } from "@udecode/plate-autoformat";
import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createUnderlinePlugin,
} from "@udecode/plate-basic-marks";
import {
  ELEMENT_BLOCKQUOTE,
  createBlockquotePlugin,
} from "@udecode/plate-block-quote";
import {
  createExitBreakPlugin,
  createSingleLinePlugin,
  createSoftBreakPlugin,
} from "@udecode/plate-break";
import { createCaptionPlugin } from "@udecode/plate-caption";
import {
  ELEMENT_CODE_BLOCK,
  createCodeBlockPlugin,
} from "@udecode/plate-code-block";
import { createComboboxPlugin } from "@udecode/plate-combobox";
import { createCommentsPlugin } from "@udecode/plate-comments";
import {
  Plate,
  PlateController,
  PlateEditor,
  PlatePluginComponent,
  TElement,
  createPlugins,
} from "@udecode/plate-common";
import { createDndPlugin } from "@udecode/plate-dnd";
import { createEmojiPlugin } from "@udecode/plate-emoji";
import { createExcalidrawPlugin } from "@udecode/plate-excalidraw";
import {
  createFontBackgroundColorPlugin,
  createFontColorPlugin,
  createFontSizePlugin,
} from "@udecode/plate-font";
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  createHeadingPlugin,
} from "@udecode/plate-heading";
import { createHighlightPlugin } from "@udecode/plate-highlight";
import { createHorizontalRulePlugin } from "@udecode/plate-horizontal-rule";
import { createIndentPlugin } from "@udecode/plate-indent";
import { createIndentListPlugin } from "@udecode/plate-indent-list";
import { createJuicePlugin } from "@udecode/plate-juice";
import { createKbdPlugin } from "@udecode/plate-kbd";
import { createColumnPlugin } from "@udecode/plate-layout";
import { createLineHeightPlugin } from "@udecode/plate-line-height";
import { createLinkPlugin } from "@udecode/plate-link";
import { createListPlugin, createTodoListPlugin } from "@udecode/plate-list";
import {
  createImagePlugin,
  createMediaEmbedPlugin,
} from "@udecode/plate-media";
import { createMentionPlugin } from "@udecode/plate-mention";
import { createNodeIdPlugin } from "@udecode/plate-node-id";
import { createNormalizeTypesPlugin } from "@udecode/plate-normalizers";
import {
  ELEMENT_PARAGRAPH,
  createParagraphPlugin,
} from "@udecode/plate-paragraph";
import { createResetNodePlugin } from "@udecode/plate-reset-node";
import {
  createDeletePlugin,
  createSelectOnBackspacePlugin,
} from "@udecode/plate-select";
import { createBlockSelectionPlugin } from "@udecode/plate-selection";
import { createDeserializeDocxPlugin } from "@udecode/plate-serializer-docx";
import { createDeserializeMdPlugin } from "@udecode/plate-serializer-md";
import { createSlashPlugin } from "@udecode/plate-slash-command";
import { createTabbablePlugin } from "@udecode/plate-tabbable";
import { createTablePlugin } from "@udecode/plate-table";
import { ELEMENT_TOGGLE, createTogglePlugin } from "@udecode/plate-toggle";
import { createTrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { settingsStore } from "@/components/context/settings-store";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import {
  FireLiComponent,
  FireMarker,
} from "@/components/plate-ui/indent-fire-marker-component";
import {
  TodoLi,
  TodoMarker,
} from "@/components/plate-ui/indent-todo-marker-component";
import { MentionCombobox } from "@/components/plate-ui/mention-combobox";
import { SlashCombobox } from "@/components/plate-ui/slash-combobox";
import { ValueId } from "@/config/customizer-plugins";
import { captionPlugin } from "@/lib/plate/plugins/captionPlugin";
import { SLASH_RULES } from "@/lib/plate/values/slashRules";
import { getDocumentDetails, updateDocument } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const usePlaygroundPlugins = ({
  id,
  components = createPlateUI(),
}: {
  id?: ValueId;
  components?: Record<string, PlatePluginComponent>;
} = {}) => {
  const enabled = settingsStore.use.checkedPlugins();

  const autoformatOptions = {
    rules: [...autoformatRules],
    enableUndoOnDelete: true,
  };

  if (id === "indentlist") {
    autoformatOptions.rules.push(...autoformatIndentLists);
  } else if (id === "list") {
    autoformatOptions.rules.push(...autoformatLists);
  } else if (!!enabled.listStyleType) {
    autoformatOptions.rules.push(...autoformatIndentLists);
  } else if (!!enabled.list) {
    autoformatOptions.rules.push(...autoformatLists);
  }

  return useMemo(
    () => {
      return createPlugins(
        [
          // Nodes
          createParagraphPlugin({ enabled: !!enabled.p }),
          createHeadingPlugin({ enabled: !!enabled.heading }),
          createBlockquotePlugin({ enabled: !!enabled.blockquote }),
          createCodeBlockPlugin({ enabled: !!enabled.code_block }),
          createHorizontalRulePlugin({ enabled: !!enabled.hr }),
          createLinkPlugin({ ...linkPlugin, enabled: !!enabled.a }),
          createListPlugin({
            enabled: id === "list" || !!enabled.list,
          }),
          createImagePlugin({ enabled: !!enabled.img }),
          createMediaEmbedPlugin({ enabled: !!enabled.media_embed }),
          createCaptionPlugin({ ...captionPlugin, enabled: !!enabled.caption }),
          createMentionPlugin({
            enabled: !!enabled.mention,
            options: {
              triggerPreviousCharPattern: /^$|^[\s"']$/,
            },
          }),
          createSlashPlugin({
            options: {
              rules: SLASH_RULES,
            },
          }),
          createTablePlugin({
            enabled: !!enabled.table,
            options: {
              enableMerging: id === "tableMerge",
            },
          }),
          createTodoListPlugin({ enabled: !!enabled.action_item }),
          createTogglePlugin({ enabled: !!enabled.toggle }),
          createExcalidrawPlugin({ enabled: !!enabled.excalidraw }),

          // Marks
          createBoldPlugin({ enabled: !!enabled.bold }),
          createItalicPlugin({ enabled: !!enabled.italic }),
          createUnderlinePlugin({ enabled: !!enabled.underline }),
          createStrikethroughPlugin({ enabled: !!enabled.strikethrough }),
          createCodePlugin({ enabled: !!enabled.code }),
          createSubscriptPlugin({ enabled: !!enabled.subscript }),
          createSuperscriptPlugin({ enabled: !!enabled.superscript }),
          createFontColorPlugin({ enabled: !!enabled.color }),
          createFontBackgroundColorPlugin({
            enabled: !!enabled.backgroundColor,
          }),
          createFontSizePlugin({ enabled: !!enabled.fontSize }),
          createHighlightPlugin({ enabled: !!enabled.highlight }),
          createKbdPlugin({ enabled: !!enabled.kbd }),

          // Block Style
          createAlignPlugin({ ...alignPlugin, enabled: !!enabled.align }),
          createIndentPlugin({
            inject: {
              props: {
                validTypes: [
                  ELEMENT_PARAGRAPH,
                  ELEMENT_H1,
                  ELEMENT_H2,
                  ELEMENT_H3,
                  ELEMENT_H4,
                  ELEMENT_H5,
                  ELEMENT_H6,
                  ELEMENT_BLOCKQUOTE,
                  ELEMENT_CODE_BLOCK,
                  ELEMENT_TOGGLE,
                ],
              },
            },
            enabled: !!enabled.indent,
          }),
          createIndentListPlugin({
            inject: {
              props: {
                validTypes: [
                  ELEMENT_PARAGRAPH,
                  ELEMENT_H1,
                  ELEMENT_H2,
                  ELEMENT_H3,
                  ELEMENT_H4,
                  ELEMENT_H5,
                  ELEMENT_H6,
                  ELEMENT_BLOCKQUOTE,
                  ELEMENT_CODE_BLOCK,
                  ELEMENT_TOGGLE,
                ],
              },
            },
            enabled: id === "indentlist" || !!enabled.listStyleType,
            options: {
              listStyleTypes: {
                todo: {
                  type: "todo",
                  markerComponent: TodoMarker,
                  liComponent: TodoLi,
                },
                fire: {
                  type: "fire",
                  markerComponent: FireMarker,
                  liComponent: FireLiComponent,
                },
              },
            },
          }),
          createLineHeightPlugin({
            ...lineHeightPlugin,
            enabled: !!enabled.lineHeight,
          }),

          // Functionality
          createAutoformatPlugin({
            enabled: !!enabled.autoformat,
            options: autoformatOptions,
          }),
          createBlockSelectionPlugin({
            options: {
              sizes: {
                top: 0,
                bottom: 0,
              },
            },
            enabled: id === "blockselection" || !!enabled.blockSelection,
          }),
          createComboboxPlugin({ enabled: !!enabled.combobox }),
          createDndPlugin({
            options: { enableScroller: true },
            enabled: !!enabled.dnd,
          }),
          createEmojiPlugin({ ...emojiPlugin, enabled: !!enabled.emoji }),
          createExitBreakPlugin({
            ...exitBreakPlugin,
            enabled: !!enabled.exitBreak,
          }),
          createNodeIdPlugin({ enabled: !!enabled.nodeId }),
          createNormalizeTypesPlugin({
            ...forcedLayoutPlugin,
            enabled: !!enabled.normalizeTypes,
          }),
          createResetNodePlugin({
            ...resetBlockTypePlugin,
            enabled: !!enabled.resetNode,
          }),
          createSelectOnBackspacePlugin({
            ...selectOnBackspacePlugin,
            enabled: !!enabled.selectOnBackspace,
          }),
          createDeletePlugin({
            enabled: !!enabled.delete,
          }),
          createSingleLinePlugin({
            enabled: id === "singleline" || !!enabled.singleLine,
          }),
          createSoftBreakPlugin({
            ...softBreakPlugin,
            enabled: !!enabled.softBreak,
          }),
          createTabbablePlugin({
            ...tabbablePlugin,
            enabled: !!enabled.tabbable,
          }),
          createTrailingBlockPlugin({
            ...trailingBlockPlugin,
            enabled: id !== "singleline" && !!enabled.trailingBlock,
          }),
          { ...dragOverCursorPlugin, enabled: !!enabled.dragOverCursor },

          // Collaboration
          createCommentsPlugin({ enabled: !!enabled.comment }),

          // Deserialization
          createDeserializeDocxPlugin({ enabled: !!enabled.deserializeDocx }),
          createDeserializeMdPlugin({ enabled: !!enabled.deserializeMd }),
          createJuicePlugin({ enabled: !!enabled.juice }),
          createColumnPlugin({ enabled: !!enabled.column }),
        ],
        {
          components,
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled]
  );
};
export default function MainEditor({
  id,
  documentId,
}: {
  id?: ValueId;
  documentId: string;
}) {
  if (!documentId) redirect("/dashboard");
  const containerRef = useRef(null);
  const enabled = settingsStore.use.checkedComponents();
  const editorRef = useRef<PlateEditor | null>(null);
  const plugins = usePlaygroundPlugins({
    id,
    components: createPlateUI(
      {},
      {
        placeholder: isEnabled("placeholder", id),
        draggable: isEnabled("dnd", id),
      }
    ),
  });
  const key = documentId;

  useEffect(() => {
    const editor = editorRef.current;
    async function fetchData() {
      const { data, error } = await getDocumentDetails(documentId);
      if (error) {
        toast.error("Failed to load the document");
        return;
      }
      editor?.reset();
      editor?.insertNodes(data?.content as TElement[]);
    }
    fetchData();
  }, [documentId]);

  const handleAutoSave = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    // Handle the case where editor is null
    const isAstChange = editor.history.undos.length;
    const value = editor.children;
    if (isAstChange) {
      console.log("Auto Save", editor);

      const { error } = await updateDocument(
        { content: value as Object },
        documentId
      );
      if (error) {
        toast.error("Failed to save the document");
      } else {
        toast.success("Document saved");
      }
    }
  }, [documentId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative h-screen">
        <PlateController>
          <Plate
            key={key}
            editorRef={editorRef}
            plugins={plugins}
            normalizeInitialValue
          >
            {/* <CustomEffect /> */}
            <CommentsProvider>
              {enabled["fixed-toolbar"] && (
                <FixedToolbar>
                  {enabled["fixed-toolbar-buttons"] && (
                    <FixedToolbarButtons id={id} />
                  )}
                </FixedToolbar>
              )}

              <div className="flex w-full h-full">
                <div
                  ref={containerRef}
                  className={cn(
                    "relative flex w-full overflow-x-auto overflow-y-auto min-h-screen",
                    "[&_.slate-start-area-top]:!h-4",
                    "[&_.slate-start-area-left]:!w-3 [&_.slate-start-area-right]:!w-3",
                    !id &&
                      "md:[&_.slate-start-area-left]:!w-[64px] md:[&_.slate-start-area-right]:!w-[64px]"
                  )}
                >
                  <Editor
                    {...editableProps}
                    placeholder=""
                    variant="ghost"
                    size="md"
                    focusRing={false}
                    onBlur={handleAutoSave}
                    className={cn(
                      editableProps.className,
                      "px-8",
                      !id && "min-h-[860px] pb-[20vh] pt-4 md:px-[96px]",
                      id && "pb-8 pt-2"
                    )}
                  />

                  {enabled["floating-toolbar"] && (
                    <FloatingToolbar>
                      {enabled["floating-toolbar-buttons"] && (
                        <FloatingToolbarButtons id={id} />
                      )}
                    </FloatingToolbar>
                  )}

                  {isEnabled("mention", id, enabled["mention-combobox"]) && (
                    <MentionCombobox items={MENTIONABLES} />
                  )}

                  <SlashCombobox items={SLASH_RULES} />

                  {isEnabled("cursoroverlay", id) && (
                    <CursorOverlay containerRef={containerRef} />
                  )}
                </div>

                {isEnabled("comment", id, enabled["comments-popover"]) && (
                  <CommentsPopover />
                )}
              </div>
            </CommentsProvider>
          </Plate>
        </PlateController>
      </div>
    </DndProvider>
  );
}
