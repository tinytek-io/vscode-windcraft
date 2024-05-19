import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { CurrentAppliedType } from "../../types/general";
import { useCallback, useMemo } from "react";
import { ColorName } from "../../types/color";

export function useColor(prefix: "bg-" | "text-" | "border-") {
  const { updateCurrentStyles, getColorByPrefix } = useExtensionState();

  const color = getColorByPrefix(prefix);
  const colorClassName: CurrentAppliedType<string | undefined> = useMemo(
    () => ({
      current: color.current ? `${prefix}${color.current}` : undefined,
      applied: color.applied ? `${prefix}${color.applied}` : undefined,
    }),
    [color, prefix]
  );

  const setColor = useCallback(
    (newColor: ColorName) => {
      updateCurrentStyles([colorClassName.current], [`${prefix}${newColor}`]);
    },
    [colorClassName, prefix, updateCurrentStyles]
  );

  const resetColor = useCallback(() => {
    updateCurrentStyles([colorClassName.current], []);
  }, [colorClassName, updateCurrentStyles]);

  return {
    color,
    colorClassName,
    setColor,
    resetColor,
  };
}
