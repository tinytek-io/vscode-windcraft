import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { useCallback, useMemo } from "react";

export function useBorderSection() {
  const { styleState, updateCurrentStyles } = useExtensionState();

  const borderClasses = useMemo(
    () => ({
      current: styleState.currentTailwindStyles.filter(
        (s) => s.startsWith("border-") || s === "border"
      ),
      applied: styleState.appliedTailwindStyles.filter(
        (s) => s.startsWith("border-") || s === "border"
      ),
      all: styleState.tailwindStyles.filter((s) => {
        const end = s.split(":").pop() ?? "";
        return end.startsWith("border-") || end === "border";
      }),
    }),
    [styleState]
  );

  const removeBorder = useCallback(
    () => updateCurrentStyles(borderClasses.all, []),
    [updateCurrentStyles, borderClasses.current]
  );
  const addBorder = useCallback(
    () => updateCurrentStyles([], ["border", "border-transparent"]),
    [updateCurrentStyles]
  );

  return {
    // State
    borderClasses,
    // Actions
    removeBorder,
    addBorder,
  };
}
