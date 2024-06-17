import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import type { CurrentAppliedType } from "../../types/general";
import { useCallback, useMemo } from "react";
import {
  type BorderWidthNormalType,
  type BorderWidthAllType,
  borderWidthPrefixMap,
  isBorderWidthNormalType,
  type BorderWidthValue,
  allBorderWidthStyles
} from "../../types/borderWidth";
import { getFluffValue } from "./useFluffValue";

export function useBorderConfig() {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const borderWidthMap: Record<BorderWidthNormalType, CurrentAppliedType<BorderWidthValue | undefined>> = useMemo(
    () => ({
      All: getFluffValue<BorderWidthValue>(
        getValueOneOf,
        "border",
        "1",
        ["border-0", "border-2", "border-4", "border-8"],
        "border-0"
      ),
      Top: getFluffValue<BorderWidthValue>(
        getValueOneOf,
        "border-t",
        "1",
        ["border-t-0", "border-t-2", "border-t-4", "border-t-8"],
        "border-0"
      ),
      Right: getFluffValue<BorderWidthValue>(
        getValueOneOf,
        "border-r",
        "1",
        ["border-r-0", "border-r-2", "border-r-4", "border-r-8"],
        "border-0"
      ),
      Bottom: getFluffValue<BorderWidthValue>(
        getValueOneOf,
        "border-b",
        "1",
        ["border-b-0", "border-b-2", "border-b-4", "border-b-8"],
        "border-0"
      ),
      Left: getFluffValue<BorderWidthValue>(
        getValueOneOf,
        "border-l",
        "1",
        ["border-l-0", "border-l-2", "border-l-4", "border-l-8"],
        "border-0"
      )
    }),
    [getValueOneOf]
  );

  const widthTypes: CurrentAppliedType<BorderWidthNormalType[]> = useMemo(
    () => ({
      current: Object.entries(borderWidthMap)
        .filter(([_, v]) => (v.current ?? "0") !== "0")
        .map(([key]) => key) as BorderWidthNormalType[],
      applied: Object.entries(borderWidthMap)
        .filter(([_, v]) => (v.applied ?? "0") !== "0")
        .map(([key]) => key) as BorderWidthNormalType[]
    }),
    [borderWidthMap]
  );

  const borderWidthType: CurrentAppliedType<BorderWidthAllType | undefined> = useMemo(
    () => ({
      current:
        widthTypes.current.length === 1 ? widthTypes.current[0] : widthTypes.current.length > 1 ? "Custom" : undefined,

      applied:
        widthTypes.applied.length === 1 ? widthTypes.applied[0] : widthTypes.applied.length > 1 ? "Custom" : undefined
    }),
    [widthTypes]
  );

  const borderWidth: CurrentAppliedType<BorderWidthValue | undefined> = useMemo(
    () => ({
      current: Object.values(borderWidthMap).find((v) => (v.current ?? v.applied) != null)?.current,

      applied: Object.values(borderWidthMap).find((v) => v.applied != null)?.applied
    }),
    [borderWidthMap]
  );

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
    [updateCurrentStyles, borderWidthType, widthTypes]
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
