import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import type { CurrentAppliedType } from "../../types/general";
import { useCallback } from "react";
import {
  type BorderWidthNormalType,
  type BorderWidthAllType,
  borderWidthPrefixMap,
  isBorderWidthNormalType,
  type BorderWidthValue,
  allBorderWidthStyles
} from "../../types/borderWidth";
import { useFluffValue } from "./useFluffValue";

export function useBorderConfig() {
  const { styleState, updateCurrentStyles } = useExtensionState();

  const borderWidthMap: Record<BorderWidthNormalType, CurrentAppliedType<BorderWidthValue | undefined>> = {
    All: useFluffValue<BorderWidthValue>("border", "1", ["border-0", "border-2", "border-4", "border-8"], "border-0"),
    Top: useFluffValue<BorderWidthValue>(
      "border-t",
      "1",
      ["border-t-0", "border-t-2", "border-t-4", "border-t-8"],
      "border-0"
    ),
    Right: useFluffValue<BorderWidthValue>(
      "border-r",
      "1",
      ["border-r-0", "border-r-2", "border-r-4", "border-r-8"],
      "border-0"
    ),
    Bottom: useFluffValue<BorderWidthValue>(
      "border-b",
      "1",
      ["border-b-0", "border-b-2", "border-b-4", "border-b-8"],
      "border-0"
    ),
    Left: useFluffValue<BorderWidthValue>(
      "border-l",
      "1",
      ["border-l-0", "border-l-2", "border-l-4", "border-l-8"],
      "border-0"
    )
  };

  const widthTypes: CurrentAppliedType<BorderWidthNormalType[]> = {
    current: Object.entries(borderWidthMap)
      .filter(([_, v]) => (v.current ?? "0") !== "0")
      .map(([key]) => key) as BorderWidthNormalType[],
    applied: Object.entries(borderWidthMap)
      .filter(([_, v]) => (v.applied ?? "0") !== "0")
      .map(([key]) => key) as BorderWidthNormalType[]
  };

  const borderWidthType: CurrentAppliedType<BorderWidthAllType | undefined> = {
    current:
      widthTypes.current.length === 1 ? widthTypes.current[0] : widthTypes.current.length > 1 ? "Custom" : undefined,

    applied:
      widthTypes.applied.length === 1 ? widthTypes.applied[0] : widthTypes.applied.length > 1 ? "Custom" : undefined
  };

  const borderWidth: CurrentAppliedType<BorderWidthValue | undefined> = {
    current: Object.values(borderWidthMap).find((v) => (v.current ?? v.applied) != null)?.current,

    applied: Object.values(borderWidthMap).find((v) => v.applied != null)?.applied
  };

  const setBorderWidth = useCallback(
    (newWidth: string) => {
      const widthType = borderWidthType.current ?? borderWidthType.applied ?? "All";
      const widthSuffix = newWidth === "1" ? "" : `-${newWidth}`;
      const prefixes =
        widthType === "Custom"
          ? widthTypes.current.flatMap((type) => borderWidthPrefixMap[type])
          : borderWidthPrefixMap[borderWidthType.current ?? borderWidthType.applied ?? "All"];
      const newClasses = prefixes.map((prefix) => `${prefix}${widthSuffix}`);

      if (widthType === "Custom" || widthType === "All") {
        updateCurrentStyles(allBorderWidthStyles, newClasses);
      } else {
        // For Top, Right, Bottom, Left we need to unset the other classes
        // TODO: Only set if state is not "root"
        updateCurrentStyles(allBorderWidthStyles, ["border-0", ...newClasses]);
      }
    },
    [updateCurrentStyles, borderWidthType]
  );

  const setBorderType = useCallback(
    (newWidthType: string) => {
      if (isBorderWidthNormalType(newWidthType)) {
        const widthSuffix =
          (borderWidth.current ?? borderWidth.applied ?? "1") === "1"
            ? ""
            : `-${borderWidth.current ?? borderWidth.applied ?? "0"}`;
        const prefixes = borderWidthPrefixMap[newWidthType];
        const newClasses = prefixes.map((prefix) => `${prefix}${widthSuffix}`);
        if (newWidthType === "Custom" || newWidthType === "All") {
          updateCurrentStyles(allBorderWidthStyles, newClasses);
        } else {
          // For Top, Right, Bottom, Left we need to unset the other classes
          // TODO: Only set if state is not "root"
          updateCurrentStyles(allBorderWidthStyles, ["border-0", ...newClasses]);
        }
      }
    },
    [updateCurrentStyles, borderWidth]
  );

  const toggleBorder = useCallback(
    (type: BorderWidthNormalType) => {
      const [prefix] = borderWidthPrefixMap[type];
      const widthSuffix =
        (borderWidth.current ?? borderWidth.applied) === "1"
          ? ""
          : `-${borderWidth.current ?? borderWidth.applied ?? "1"}`;
      const className = `${prefix}${widthSuffix}`;
      if (borderWidthMap[type].current) {
        updateCurrentStyles([className], []);
      } else {
        updateCurrentStyles([], [className]);
      }
    },
    [updateCurrentStyles, borderWidthMap, borderWidth]
  );

  return {
    // State
    borderWidthMap,
    borderWidthType,
    borderWidth,
    // Actions
    setBorderWidth,
    setBorderType,
    toggleBorder
  };
}
