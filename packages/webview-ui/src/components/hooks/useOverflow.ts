import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { useCallback } from "react";

export function useOverflow() {
  const { getValueOneOf, updateCurrentStyles } = useExtensionState();
  const clipContent = getValueOneOf(["overflow-hidden", "overflow-auto"]);

  const toggleClipContent = useCallback(() => {
    const currentClipContent = (clipContent.current ?? clipContent.applied) === "overflow-hidden";
    const appliedClipContent = clipContent.applied === "overflow-hidden";

    if (currentClipContent === appliedClipContent) {
      // New value is different from the applied value
      updateCurrentStyles(
        ["overflow-hidden", "overflow-auto"],
        [currentClipContent ? "overflow-auto" : "overflow-hidden"]
      );
    } else {
      // New value is the same as the applied value
      updateCurrentStyles(["overflow-hidden", "overflow-auto"], []);
    }
  }, [clipContent]);

  return {
    clipContent,
    toggleClipContent
  };
}
