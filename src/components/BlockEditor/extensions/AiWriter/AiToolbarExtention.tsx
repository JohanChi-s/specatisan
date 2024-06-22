import "@tiptap/extension-text-style";

import { Extension } from "@tiptap/core";

export type AiQuickOptions = {
  /**
   * The types where the aiQuick can be applied
   * @default ['textStyle']
   * @example ['heading', 'paragraph']
   */
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiQuick: {
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

/**
 * This extension allows you to aiQuick your text.
 * @see https://tiptap.dev/api/extensions/aiQuick
 */
export const AiQuick = Extension.create<AiQuickOptions>({
  name: "aiQuick",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [];
  },

  addCommands() {
    return {
      aiSimplify:
        () =>
        ({ chain, state }) => {
          const { from, to } = state.selection;
          if (from !== to) {
            const slice = state.doc.slice(from, to);
            console.log(
              "select text: ",
              slice.content.textBetween(0, slice.size)
            );
          }

          return chain().focus().run();
        },
      aiEmojify:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
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
                type: "translate",
                data,
              },
            })
            .run(),
    };
  },
});
