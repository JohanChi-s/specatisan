"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";

import { API } from "@/lib/BlockEditor/api";

import {
  BlockquoteFigure,
  CharacterCount,
  Color,
  Document,
  Dropcursor,
  Emoji,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  emojiSuggestion,
  Columns,
  Column,
  TaskItem,
  TaskList,
  CodeBlock,
} from ".";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import DetailsContent from "@tiptap-pro/extension-details-content";
import { ImageUpload } from "./ImageUpload";
import { TableOfContentsNode } from "./TableOfContentsNode";
import Details from "@tiptap-pro/extension-details";
import { emojis } from "@tiptap-pro/extension-emoji";
import { lowlight } from "lowlight/lib/core";
import { AiWriter } from "./AiWriter";
import { AiQuick } from "./AiWriter/AiToolbarExtention";

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null;
  userId?: string;
  userName?: string;
  userColor?: string;
}

export const ExtensionKit = ({ provider }: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  AiWriter.configure({
    authorId: "",
    authorName: "",
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  AiQuick,
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: "details",
    },
  }),
  DetailsSummary,
  DetailsContent,
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === "detailsSummary") {
        return "Summary";
      }

      return "";
    },
  }),
  CodeBlock.configure({
    languageClassPrefix: "language-",
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  ImageUpload.configure({
    clientId: provider?.document?.clientID,
  }),
  ImageBlock,
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (currentEditor, files, pos) => {
      files.forEach(async (file) => {
        const url = await API.uploadImage(file);

        currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run();
      });
    },
    onPaste: (currentEditor, files) => {
      files.forEach(async (file) => {
        const url = await API.uploadImage(file);

        return currentEditor
          .chain()
          .setImageBlockAt({
            pos: currentEditor.state.selection.anchor,
            src: url,
          })
          .focus()
          .run();
      });
    },
  }),
  Emoji.configure({
    enableEmoticons: true,
    emojis: emojis,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border-black",
  }),
];

export default ExtensionKit;
