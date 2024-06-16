import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { paddingNone, paddingValues } from "../../types/padding";

export function usePadding() {
  const { getValueByPrefix, updateCurrentStyles } = useExtensionState();

  // Padding x and y
  const x = getValueByPrefix("px-");
  const y = getValueByPrefix("py-");

  // Padding left, right, top, bottom
  const left = getValueByPrefix("pl-");
  const right = getValueByPrefix("pr-");
  const top = getValueByPrefix("pt-");
  const bottom = getValueByPrefix("pb-");

  const currentAdvanced = [left.current, right.current, top.current, bottom.current].filter(Boolean).length
    ? true
    : undefined;
  const appliedAdvanced = [left.applied, right.applied, top.applied, bottom.applied].filter(Boolean).length
    ? true
    : undefined;
  const currentSimple = x.current || y.current ? false : undefined;
  const appliedSimple = x.applied || y.applied ? false : undefined;

  const isAdvancedCurrent = currentAdvanced ?? currentSimple;
  const isAdvancedApplied = appliedAdvanced ?? appliedSimple;

  const isAdvanced = isAdvancedCurrent ?? isAdvancedApplied ?? false;
  const isAdvancedChanged = isAdvanced !== (isAdvancedApplied ?? false);

  const toggleMode = useCallback(() => {
    if (isAdvanced) {
      const px = left.current ?? right.current ?? left.applied ?? right.applied ?? paddingNone;
      const py = top.current ?? bottom.current ?? top.applied ?? bottom.applied ?? paddingNone;
      updateCurrentStyles(
        paddingValues.flatMap((p) => [`pl-${p}`, `pr-${p}`, `pt-${p}`, `pb-${p}`]),
        [[`px-${px}`], [`py-${py}`]].flat()
      );
    } else {
      const px = x.current ?? x.applied ?? paddingNone;
      const py = y.current ?? y.applied ?? paddingNone;
      updateCurrentStyles(
        paddingValues.flatMap((p) => [`px-${p}`, `py-${p}`]),
        [
          [`pl-${px}`, `pr-${px}`],
          [`pt-${py}`, `pb-${py}`]
        ].flat()
      );
    }
  }, [x, y, left, right, top, bottom, updateCurrentStyles]);

  const updateX = useCallback(
    (newPadding: string) => {
      if (newPadding === (x.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((px) => `px-${px}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((px) => `px-${px}`),
          [`px-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, x]
  );

  const updateY = useCallback(
    (newPadding: string) => {
      if (newPadding === (y.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((py) => `py-${py}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((py) => `py-${py}`),
          [`py-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, y]
  );

  const updateTop = useCallback(
    (newPadding: string) => {
      if (newPadding === (top.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((pt) => `pt-${pt}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((pt) => `pt-${pt}`),
          [`pt-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, top]
  );

  const updateBottom = useCallback(
    (newPadding: string) => {
      if (newPadding === (bottom.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((pb) => `pb-${pb}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((pb) => `pb-${pb}`),
          [`pb-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, bottom]
  );

  const updateLeft = useCallback(
    (newPadding: string) => {
      if (newPadding === (left.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((pl) => `pl-${pl}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((pl) => `pl-${pl}`),
          [`pl-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, left]
  );

  const updateRight = useCallback(
    (newPadding: string) => {
      if (newPadding === (right.applied ?? paddingNone)) {
        updateCurrentStyles(
          paddingValues.map((pr) => `pr-${pr}`),
          []
        );
      } else {
        updateCurrentStyles(
          paddingValues.map((pr) => `pr-${pr}`),
          [`pr-${newPadding}`]
        );
      }
    },
    [updateCurrentStyles, right]
  );

  return {
    x,
    y,
    left,
    right,
    top,
    bottom,
    isAdvanced,
    isAdvancedChanged,
    // Methods
    toggleMode,
    updateX,
    updateY,
    updateTop,
    updateBottom,
    updateLeft,
    updateRight
  };
}
