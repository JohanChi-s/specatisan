import { useMemo } from "react";
import { mapNodeId } from "@/lib/plate/mapNodeId";
import { Value } from "@udecode/plate-common";

import { customizerPlugins, ValueId } from "@/config/customizer-plugins";
import { settingsStore } from "@/components/context/settings-store";

import { alignValue } from "./alignValue";
import { basicElementsValue } from "./basicElementsValue";
import { basicMarksValue } from "./basicMarksValue";
import { commentsValue } from "./commentsValue";
import { cursorOverlayValue } from "./cursorOverlayValue";
import { deserializeCsvValue } from "./deserializeCsvValue";
import { deserializeDocxValue } from "./deserializeDocxValue";
import { deserializeMdValue } from "./deserializeMdValue";
import { excalidrawValue } from "./excalidrawValue";
import { exitBreakValue, trailingBlockValue } from "./exitBreakValue";
import { fontValue } from "./fontValue";
import { highlightValue } from "./highlightValue";
import { horizontalRuleValue } from "./horizontalRuleValue";
import { indentListValue } from "./indentListValue";
import { indentValue } from "./indentValue";
import { kbdValue } from "./kbdValue";
import { lineHeightValue } from "./lineHeightValue";
import { linkValue } from "./linkValue";
import { mediaValue } from "./mediaValue";
import { mentionValue } from "./mentionValue";
import { softBreakValue } from "./softBreakValue";
import { tabbableValue } from "./tabbableValue";
import { tableMergeValue, tableValue } from "./tableValue";
import { toggleValue } from "./toggleValue";

export const usePlaygroundValue = (id?: ValueId) => {
  let valueId = settingsStore.use.valueId();
  if (id) {
    valueId = id;
  }
  const enabled = settingsStore.use.checkedPlugins();

  return useMemo(() => {
    const value = [...basicElementsValue];

    if (enabled.a) value.push(...linkValue);

    value.push(...basicMarksValue);

    if (valueId === "tableMerge") {
      return mapNodeId(tableMergeValue);
    }

    if (valueId !== customizerPlugins.playground.id) {
      const newValue = (customizerPlugins as any)[valueId]?.value ?? value;
      return mapNodeId(newValue);
    }

    // Marks
    if (enabled.color || enabled.backgroundColor) value.push(...fontValue);
    if (enabled.highlight) value.push(...highlightValue);
    if (enabled.kbd) value.push(...kbdValue);

    // Inline nodes
    if (enabled.mention) value.push(...mentionValue);

    // Nodes
    if (enabled.align) value.push(...alignValue);
    if (enabled.lineHeight) value.push(...lineHeightValue);
    if (enabled.indent) value.push(...indentValue);
    if (enabled.listStyleType) value.push(...indentListValue);
    if (enabled.hr) value.push(...horizontalRuleValue);
    if (enabled.img || enabled.media_embed) value.push(...mediaValue);
    if (enabled.table) value.push(...tableValue);
    if (enabled.toggle) value.push(...toggleValue);

    // Functionalities
    if (enabled.softBreak) value.push(...softBreakValue);
    if (enabled.exitBreak) value.push(...exitBreakValue);
    if (enabled.dragOverCursor) value.push(...cursorOverlayValue);
    if (enabled.tabbable) value.push(...tabbableValue);

    // Collaboration
    if (enabled.comment) value.push(...commentsValue);

    // Deserialization
    if (enabled.deserializeMd) value.push(...deserializeMdValue);
    if (enabled.deserializeDocx) value.push(...deserializeDocxValue);
    if (enabled.deserializeCsv) value.push(...deserializeCsvValue);

    // Exceptions
    if (enabled.trailingBlock) value.push(...trailingBlockValue);
    if (enabled.excalidraw) value.push(...excalidrawValue);

    return mapNodeId(value) as Value;
  }, [
    enabled.a,
    enabled.align,
    enabled.backgroundColor,
    enabled.color,
    enabled.comment,
    enabled.deserializeCsv,
    enabled.deserializeDocx,
    enabled.deserializeMd,
    enabled.dragOverCursor,
    enabled.excalidraw,
    enabled.exitBreak,
    enabled.highlight,
    enabled.hr,
    enabled.img,
    enabled.indent,
    enabled.kbd,
    enabled.lineHeight,
    enabled.listStyleType,
    enabled.media_embed,
    enabled.mention,
    enabled.softBreak,
    enabled.tabbable,
    enabled.table,
    enabled.toggle,
    enabled.trailingBlock,
    valueId,
  ]);
};
