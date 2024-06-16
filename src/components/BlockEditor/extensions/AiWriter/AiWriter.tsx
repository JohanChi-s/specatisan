import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v4 as uuid } from "uuid";

import { AiWriterView } from "./components/AiWriterView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiWriter: {
      setAiWriter: () => ReturnType;
      aiSimplify: () => ReturnType;
      aiEmojify: () => ReturnType;
      aiComplete: () => ReturnType;
      aiFixSpellingAndGrammar: () => ReturnType;
      aiExtend: () => ReturnType;
      aiShorten: () => ReturnType;
      aiTldr: () => ReturnType;
      aiAdjustTone: (tone: any) => ReturnType;
      aiTranslate: (lang: any) => ReturnType;
    };
  }
}

export const AiWriter = Node.create({
  name: "aiWriter",

  group: "block",

  draggable: true,

  addOptions() {
    return {
      authorId: undefined,
      authorName: undefined,
      HTMLAttributes: {
        class: `node-${this.name}`,
      },
    };
  },

  addAttributes() {
    return {
      id: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
      authorId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-author-id"),
        renderHTML: (attributes) => ({
          "data-author-id": attributes.authorId,
        }),
      },
      authorName: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-author-name"),
        renderHTML: (attributes) => ({
          "data-author-name": attributes.authorName,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div.node-${this.name}`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setAiWriter:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
              },
            })
            .run(),
      aiSimplify:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "simplify",
              },
            })
            .run(),
      aiEmojify:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "emojify",
              },
            })
            .run(),
      aiComplete:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "complete",
              },
            })
            .run(),
      aiFixSpellingAndGrammar:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "fixSpellingAndGrammar",
              },
            })
            .run(),
      aiExtend:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "extend",
              },
            })
            .run(),
      aiShorten:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "shorten",
              },
            })
            .run(),
      aiTldr:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "tldr",
              },
            })
            .run(),
      aiAdjustTone:
        (data: any) =>
        ({ chain }: any) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "adjustTone",
                data,
              },
            })
            .run(),
      aiTranslate:
        (data: any) =>
        ({ chain }: any) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: uuid(),
                authorId: this.options.authorId,
                authorName: this.options.authorName,
                type: "translate",
                data,
              },
            })
            .run(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiWriterView);
  },
});

export default AiWriter;
