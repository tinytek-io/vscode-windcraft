import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { gapNone, gapValues } from "../../types/gap";

const allClasses = gapValues.map((g) => [`gap-${g}`, `gap-x-${g}`, `gap-y-${g}`]).flat();
const allClassesX = gapValues.map((g) => [`gap-${g}`, `gap-x-${g}`]).flat();
const allClassesY = gapValues.map((g) => [`gap-${g}`, `gap-y-${g}`]).flat();

export function useGap() {
  const { updateCurrentStyles, getValueByPrefix } = useExtensionState();

  const x = getValueByPrefix("gap-x-");
  const y = getValueByPrefix("gap-y-");
  const value = getValueByPrefix("gap-", ["gap-x-", "gap-y-"]);

  const updateValue = useCallback(
    (newGap: string) => {
      if (newGap === (value.applied ?? gapNone)) {
        updateCurrentStyles(allClasses, []);
      } else {
        updateCurrentStyles(allClasses, [`gap-${newGap}`]);
      }
    },
    [updateCurrentStyles, value]
  );

  const updateX = useCallback(
    (newGap: string) => {
      if (newGap === (x.applied ?? gapNone)) {
        updateCurrentStyles(allClassesX, []);
      } else {
        updateCurrentStyles(allClassesX, [`gap-x-${newGap}`]);
      }
    },
    [updateCurrentStyles, x]
  );

  const updateY = useCallback(
    (newGap: string) => {
      if (newGap === (y.applied ?? gapNone)) {
        updateCurrentStyles(allClassesY, []);
      } else {
        updateCurrentStyles(allClassesY, [`gap-y-${newGap}`]);
      }
    },
    [updateCurrentStyles, y]
  );

  return {
    x,
    y,
    value,
    // Methods
    updateValue,
    updateX,
    updateY
  };
}
