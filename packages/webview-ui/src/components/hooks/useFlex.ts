import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { CurrentAppliedType } from "../../types/general";
import { useValue } from "./useValue";
import { useGap } from "./useGap";
import { gapClasses, gapNone, gapValues } from "../../types/gap";

export type FlexDirection = "flex-row" | "flex-col" | "flex-wrap";

const allClasses = [...gapClasses, ...["flex-row", "flex-col", "flex-wrap"]].flat();

export function useFlex() {
  const { styleState, updateCurrentStyles, hasExactValue, getValueOneOf } = useExtensionState();
  const gap = useGap();

  const enabled = hasExactValue("flex");

  const rawDir = getValueOneOf(["flex-wrap", "flex-col", "flex-row"]);

  const direction: CurrentAppliedType<string | undefined> = {
    current: rawDir.current ?? rawDir.applied,
    applied: rawDir.applied
  };

  const addFlex = useCallback(() => {
    updateCurrentStyles([], ["flex"]);
  }, [updateCurrentStyles]);

  const removeFlex = useCallback(() => {
    const classes = styleState.bothTailwindStyles.filter(
      (c) =>
        ["flex", "flex-col", "flex-row", "flex-wrap"].includes(c) ||
        c.startsWith("gap-") ||
        // c.startsWith("gap-x-") ||
        // c.startsWith("gap-y-") ||
        c.startsWith("p-") ||
        c.startsWith("px-") ||
        c.startsWith("py-") ||
        c.startsWith("pt-") ||
        c.startsWith("pr-") ||
        c.startsWith("pb-") ||
        c.startsWith("pl-") ||
        c.startsWith("justify-") ||
        c.startsWith("items-")
    );
    updateCurrentStyles(classes, []);
  }, [updateCurrentStyles, styleState]);

  const setDirection = useCallback(
    (newDirection: FlexDirection) => {
      if (newDirection === "flex-col") {
        // Set gap prioritize value, then y
        const newGap =
          gap.value.current ??
          gap.y.current ??
          gap.x.current ??
          gap.value.applied ??
          gap.y.applied ??
          gap.x.applied ??
          gapNone;
        updateCurrentStyles(allClasses, [
          direction.applied !== "flex-col" ? "flex-col" : null,
          newGap !== gapNone ? `gap-${newGap}` : null
        ]);
      }

      if (newDirection === "flex-row") {
        // Set gap prioritize value, then x
        const newGap =
          gap.value.current ??
          gap.x.current ??
          gap.y.current ??
          gap.value.applied ??
          gap.x.applied ??
          gap.y.applied ??
          gapNone;
        updateCurrentStyles(allClasses, [
          direction.applied !== "flex-row" ? "flex-row" : null,
          newGap !== gapNone ? `gap-${newGap}` : null
        ]);
      }

      if (newDirection === "flex-wrap") {
        // Set gap x and y using specific or general value
        const newGapX = gap.x.current ?? gap.value.current ?? gap.x.applied ?? gap.value.applied ?? gapNone;
        const newGapY = gap.y.current ?? gap.value.current ?? gap.y.applied ?? gap.value.applied ?? gapNone;
        updateCurrentStyles(allClasses, [
          direction.applied !== "flex-wrap" ? "flex-wrap" : null,
          newGapX !== gapNone ? `gap-x-${newGapX}` : null,
          newGapY !== gapNone ? `gap-y-${newGapY}` : null
        ]);
      }
    },
    [updateCurrentStyles, gap, direction]
  );

  return {
    // State
    enabled: enabled.current || enabled.applied,
    direction,
    // Methods
    addFlex,
    removeFlex,
    setDirection
  };
}
