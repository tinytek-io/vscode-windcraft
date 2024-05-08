import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { widthClasses, widthNone, widthPrefix } from "../../types/width";

export function useWidth() {
  const { updateCurrentStyles, getValueByPrefix } = useExtensionState();

  const width = getValueByPrefix(widthPrefix);

  const setWidth = useCallback((newWidth: string) => {
    const appliedWidth = width.applied ?? widthNone;
    if (newWidth === appliedWidth) {
      // New value is the same as the applied value, we don't need to set it again
      updateCurrentStyles(widthClasses, []);
    } else {
      updateCurrentStyles(widthClasses, [`${widthPrefix}${newWidth}`]);
    }
  }, [width, updateCurrentStyles]);

  return {
    width,
    setWidth,
  };
}
