import { useCallback, useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import type { CurrentAppliedType } from "../../types/general";
import { heightClasses, heightNone, heightPrefix } from "../../types/height";
import { aspectRatioClasses, aspectRatioNone, aspectRatioPrefix, getAspectRatioValue } from "../../types/aspectRatio";

export function useHeightOrAspectRatio() {
  const { updateCurrentStyles, getValueOneOf } = useExtensionState();

  const value = getValueOneOf([...aspectRatioClasses, ...heightClasses]);
  const height = getPrefixValue(heightPrefix, value);
  const aspectRatio = getPrefixValue(aspectRatioPrefix, value);

  const isAspectRatio = useMemo(() => {
    if (aspectRatio.current) {
      return true;
    }
    if (height.current) {
      return false;
    }
    if (aspectRatio.applied) {
      return true;
    }
    if (height.applied) {
      return false;
    }
    return false;
  }, [aspectRatio, height]);

  const isAspectRatioToggled = useMemo(() => {
    return !!(aspectRatio.current && height.applied) || !!(height.current && aspectRatio.applied);
  }, [aspectRatio, height]);

  const setHeight = useCallback(
    (newHeight: string) => {
      const appliedHeight = height.applied ?? heightNone;
      if (newHeight === appliedHeight) {
        // New value is the same as the applied value, we don't need to set it again
        updateCurrentStyles(heightClasses, []);
      } else {
        updateCurrentStyles(heightClasses, [`${heightPrefix}${newHeight}`]);
      }
    },
    [height, updateCurrentStyles]
  );

  const setAspectRatio = useCallback(
    (newAspectRatio: string) => {
      const appliedAspectRatio = aspectRatio.applied ?? aspectRatioNone;
      if (newAspectRatio === appliedAspectRatio) {
        updateCurrentStyles(aspectRatioClasses, []);
      } else {
        updateCurrentStyles(aspectRatioClasses, [`${aspectRatioPrefix}${newAspectRatio}`]);
      }
    },
    [aspectRatio, updateCurrentStyles]
  );

  const toggleHeightOrAspectRatio = useCallback(() => {
    if (isAspectRatio) {
      // Set height mode
      updateCurrentStyles(aspectRatioClasses, ["h-0"]);
    } else {
      // Set aspect ratio mode
      const oldValue = aspectRatio.applied ?? aspectRatioNone;
      const newValue = aspectRatio.current ?? aspectRatio.applied ?? aspectRatioNone;
      if (newValue === oldValue) {
        updateCurrentStyles(heightClasses, []);
      } else {
        updateCurrentStyles(heightClasses, [getAspectRatioValue(newValue)]);
      }
    }
  }, [updateCurrentStyles, aspectRatio, isAspectRatio]);

  return {
    isAspectRatio,
    isAspectRatioToggled,
    height,
    aspectRatio,
    setHeight,
    setAspectRatio,
    toggleHeightOrAspectRatio
  };
}

function getPrefixValue(
  prefix: string,
  value: CurrentAppliedType<string | undefined>
): CurrentAppliedType<string | undefined> {
  return {
    current: value.current?.startsWith(prefix) ? value.current.slice(prefix.length) : undefined,
    applied: value.applied?.startsWith(prefix) ? value.applied.slice(prefix.length) : undefined
  };
}
