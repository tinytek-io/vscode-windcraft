import { useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { CurrentAppliedType } from "../../types/general";

export function useValue<V extends string>(needles: V[], defaultValue: NoInfer<V>): CurrentAppliedType<V> {
  const { styleState } = useExtensionState();

  return useMemo(
    () => ({
      current: (styleState.currentTailwindStyles.find((s) => needles.some((c) => s.endsWith(c))) as V) ?? defaultValue,
      applied: (styleState.appliedTailwindStyles.find((s) => needles.some((c) => s.endsWith(c))) as V) ?? defaultValue
    }),
    [styleState, needles, defaultValue]
  );
}
