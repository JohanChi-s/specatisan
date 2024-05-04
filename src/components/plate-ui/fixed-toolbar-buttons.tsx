import React from "react";
import { isEnabled } from "@/lib/plate/is-enabled";
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { useEditorReadOnly } from "@udecode/plate-common";
import { MARK_BG_COLOR, MARK_COLOR } from "@udecode/plate-font";
import { KEY_LIST_STYLE_TYPE, ListStyleType } from "@udecode/plate-indent-list";
import { ELEMENT_OL, ELEMENT_UL } from "@udecode/plate-list";
import { ELEMENT_IMAGE } from "@udecode/plate-media";

import { ValueId } from "@/config/customizer-plugins";
import { settingsStore } from "@/components/context/settings-store";
import { Icons, iconVariants } from "@/components/icons";
import { AlignDropdownMenu } from "@/components/plate-ui/align-dropdown-menu";
import { ColorDropdownMenu } from "@/components/plate-ui/color-dropdown-menu";
import { CommentToolbarButton } from "@/components/plate-ui/comment-toolbar-button";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import { IndentListToolbarButton } from "@/components/plate-ui/indent-list-toolbar-button";
import { IndentTodoToolbarButton } from "@/components/plate-ui/indent-todo-toolbar-button";
import { IndentToolbarButton } from "@/components/plate-ui/indent-toolbar-button";
import { LineHeightDropdownMenu } from "@/components/plate-ui/line-height-dropdown-menu";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";
import { ListToolbarButton } from "@/components/plate-ui/list-toolbar-button";
import { MarkToolbarButton } from "@/components/plate-ui/mark-toolbar-button";
import { MediaToolbarButton } from "@/components/plate-ui/media-toolbar-button";
import { OutdentToolbarButton } from "@/components/plate-ui/outdent-toolbar-button";
import { TableDropdownMenu } from "@/components/plate-ui/table-dropdown-menu";
import { ToggleToolbarButton } from "@/components/plate-ui/toggle-toolbar-button";
import { ToolbarGroup } from "@/components/plate-ui/toolbar";

import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { MoreDropdownMenu } from "./more-dropdown-menu";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FixedToolbarButtons({ id }: { id?: ValueId }) {
  const readOnly = useEditorReadOnly();
  const indentList = settingsStore.use.checkedId(KEY_LIST_STYLE_TYPE);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          // Conceal the first separator on each line using overflow
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDropdownMenu />
              {isEnabled("basicnodes", id) && <TurnIntoDropdownMenu />}
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton tooltip="Bold (⌘+B)" nodeType={MARK_BOLD}>
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Italic (⌘+I)" nodeType={MARK_ITALIC}>
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                tooltip="Underline (⌘+U)"
                nodeType={MARK_UNDERLINE}
              >
                <Icons.underline />
              </MarkToolbarButton>

              {isEnabled("basicnodes", id) && (
                <>
                  <MarkToolbarButton
                    tooltip="Strikethrough (⌘+⇧+M)"
                    nodeType={MARK_STRIKETHROUGH}
                  >
                    <Icons.strikethrough />
                  </MarkToolbarButton>
                  <MarkToolbarButton tooltip="Code (⌘+E)" nodeType={MARK_CODE}>
                    <Icons.code />
                  </MarkToolbarButton>
                </>
              )}

              {isEnabled("font", id) && (
                <>
                  <ColorDropdownMenu nodeType={MARK_COLOR} tooltip="Text Color">
                    <Icons.color
                      className={iconVariants({ variant: "toolbar" })}
                    />
                  </ColorDropdownMenu>
                  <ColorDropdownMenu
                    nodeType={MARK_BG_COLOR}
                    tooltip="Highlight Color"
                  >
                    <Icons.bg
                      className={iconVariants({ variant: "toolbar" })}
                    />
                  </ColorDropdownMenu>
                </>
              )}
            </ToolbarGroup>

            <ToolbarGroup>
              {isEnabled("align", id) && <AlignDropdownMenu />}

              {isEnabled("lineheight", id) && <LineHeightDropdownMenu />}

              {isEnabled("indentlist", id) && indentList && (
                <>
                  <IndentListToolbarButton nodeType={ListStyleType.Disc} />
                  <IndentListToolbarButton nodeType={ListStyleType.Decimal} />
                  <IndentTodoToolbarButton />
                </>
              )}

              {isEnabled("list", id) && !indentList && (
                <>
                  <ListToolbarButton nodeType={ELEMENT_UL} />
                  <ListToolbarButton nodeType={ELEMENT_OL} />
                </>
              )}

              {(isEnabled("indent", id) ||
                isEnabled("list", id) ||
                isEnabled("indentlist", id)) && (
                <>
                  <OutdentToolbarButton />
                  <IndentToolbarButton />
                </>
              )}
            </ToolbarGroup>

            <ToolbarGroup>
              {isEnabled("link", id) && <LinkToolbarButton />}

              {isEnabled("toggle", id) && <ToggleToolbarButton />}

              {isEnabled("media", id) && (
                <MediaToolbarButton nodeType={ELEMENT_IMAGE} />
              )}

              {isEnabled("table", id) && <TableDropdownMenu />}

              {isEnabled("emoji", id) && <EmojiDropdownMenu />}

              <MoreDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />

        <ToolbarGroup noSeparator>
          {isEnabled("comment", id) && <CommentToolbarButton />}
          <ModeDropdownMenu />
        </ToolbarGroup>
      </div>
    </div>
  );
}
