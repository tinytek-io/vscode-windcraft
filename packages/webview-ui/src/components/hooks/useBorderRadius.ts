import { useCallback, useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import type { CurrentAppliedType } from "../../types/general";
import {
  borderRadiusClasses,
  borderRadiusMap,
  borderRadiusClassesBL,
  borderRadiusClassesBR,
  borderRadiusClassesTL,
  borderRadiusClassesTR,
  borderRadiusNone,
  borderRadiusClassesAll
} from "../../types/borderRadius";

export function useBorderRadius() {
  const { updateCurrentStyles, getBySuffix } = useExtensionState();

  const borderRadius = getBySuffix("rounded", borderRadiusMap);

  const borderRadiusTL = getBySuffix("rounded-tl", borderRadiusMap);
  const borderRadiusTR = getBySuffix("rounded-tr", borderRadiusMap);
  const borderRadiusBR = getBySuffix("rounded-br", borderRadiusMap);
  const borderRadiusBL = getBySuffix("rounded-bl", borderRadiusMap);

  const multipleBorderRadius: CurrentAppliedType<boolean> = useMemo(
    () => ({
      current:
        borderRadius.current == null &&
        (borderRadiusTL.current != null ||
          borderRadiusTR.current != null ||
          borderRadiusBR.current != null ||
          borderRadiusBL.current != null),
      applied:
        borderRadius.applied == null &&
        (borderRadiusTL.applied != null ||
          borderRadiusTR.applied != null ||
          borderRadiusBR.applied != null ||
          borderRadiusBL.applied != null)
    }),
    [borderRadius, borderRadiusTL, borderRadiusTR, borderRadiusBR, borderRadiusBL]
  );

  const setBorderRadius = useCallback(
    (newBorderRadius: string) => {
      const appliedBorderRadius = borderRadius.applied ?? borderRadiusNone;
      if (newBorderRadius === appliedBorderRadius) {
        updateCurrentStyles(borderRadiusClasses, []);
      } else {
        updateCurrentStyles(borderRadiusClasses, [`rounded-${newBorderRadius}`]);
      }
    },
    [borderRadius, updateCurrentStyles]
  );

  const setBorderRadiusTL = useCallback(
    (newBorderRadius: string) => {
      const appliedBorderRadius = borderRadiusTL.applied ?? borderRadiusNone;
      if (newBorderRadius === appliedBorderRadius) {
        updateCurrentStyles(borderRadiusClassesTL, []);
      } else {
        updateCurrentStyles(borderRadiusClassesTL, [`rounded-tl-${newBorderRadius}`]);
      }
    },
    [updateCurrentStyles, borderRadiusTL]
  );

  const setBorderRadiusTR = useCallback(
    (newBorderRadius: string) => {
      const appliedBorderRadius = borderRadiusTR.applied ?? borderRadiusNone;
      if (newBorderRadius === appliedBorderRadius) {
        updateCurrentStyles(borderRadiusClassesTR, []);
      } else {
        updateCurrentStyles(borderRadiusClassesTR, [`rounded-tr-${newBorderRadius}`]);
      }
    },
    [updateCurrentStyles, borderRadiusTR]
  );

  const setBorderRadiusBR = useCallback(
    (newBorderRadius: string) => {
      const appliedBorderRadius = borderRadiusBR.applied ?? borderRadiusNone;
      if (newBorderRadius === appliedBorderRadius) {
        updateCurrentStyles(borderRadiusClassesBR, []);
      } else {
        updateCurrentStyles(borderRadiusClassesBR, [`rounded-br-${newBorderRadius}`]);
      }
    },
    [updateCurrentStyles, borderRadiusBR]
  );

  const setBorderRadiusBL = useCallback(
    (newBorderRadius: string) => {
      const appliedBorderRadius = borderRadiusBL.applied ?? borderRadiusNone;
      if (newBorderRadius === appliedBorderRadius) {
        updateCurrentStyles(borderRadiusClassesBL, []);
      } else {
        updateCurrentStyles(borderRadiusClassesBL, [`rounded-bl-${newBorderRadius}`]);
      }
    },
    [updateCurrentStyles, borderRadiusBL]
  );

  const toggleMultipleBorderRadius = useCallback(() => {
    const newBorderRadius =
      borderRadius.current ??
      borderRadiusTL.current ??
      borderRadiusBL.current ??
      borderRadiusTR.current ??
      borderRadiusBR.current ??
      borderRadiusNone;
    if (multipleBorderRadius.current) {
      updateCurrentStyles(borderRadiusClassesAll, [`rounded${borderRadiusMap.get(newBorderRadius)}`]);
    } else {
      updateCurrentStyles(borderRadiusClassesAll, [
        `rounded-tr${borderRadiusMap.get(newBorderRadius)}`,
        `rounded-tl${borderRadiusMap.get(newBorderRadius)}`,
        `rounded-br${borderRadiusMap.get(newBorderRadius)}`,
        `rounded-bl${borderRadiusMap.get(newBorderRadius)}`
      ]);
    }
  }, [
    borderRadius,
    borderRadiusTL,
    borderRadiusBL,
    borderRadiusTR,
    borderRadiusBR,
    multipleBorderRadius,
    updateCurrentStyles
  ]);

  return {
    // State
    borderRadius,
    borderRadiusTL,
    borderRadiusTR,
    borderRadiusBR,
    borderRadiusBL,
    multipleBorderRadius,
    // Actions
    setBorderRadius,
    setBorderRadiusTL,
    setBorderRadiusTR,
    setBorderRadiusBR,
    setBorderRadiusBL,
    toggleMultipleBorderRadius
  };
}
