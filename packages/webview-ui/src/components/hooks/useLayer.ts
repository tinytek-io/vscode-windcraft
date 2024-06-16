import { useCallback, useMemo } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import {
  getMixBlendInputValue,
  opacityNone,
  type MixBlendInputValue,
  isMixBlendInputValue,
  mixBlendNone,
  getMixBlendClassName
} from "../../types/layer";

export function useLayer() {
  const { getValueByPrefix, updateCurrentStyles, getValueOneOf } = useExtensionState();

  const mixBlend = getMixBlendInputValue(getValueByPrefix("mix-blend-"));
  const opacities = getValueByPrefix("opacity-");
  const opacity = useMemo(
    () => ({
      current: opacities.current ?? opacities.applied ?? opacityNone,
      applied: opacities.applied ?? opacityNone
    }),
    [opacities]
  );

  const hiddenValue = getValueOneOf(["visible", "invisible"]);

  /**
   * hidden is true if the element is hidden, false if it is visible, and
   * undefined if it is neither hidden nor visible.
   */
  const hidden = useMemo(
    () => ({
      current: hiddenValue.current === "visible" ? false : hiddenValue.current === "invisible" ? true : undefined,
      applied: hiddenValue.applied === "visible" ? false : hiddenValue.applied === "invisible" ? true : undefined
    }),
    [hiddenValue]
  );

  const setMixBlend = useCallback(
    (value: string | MixBlendInputValue) => {
      if (isMixBlendInputValue(value) && value !== mixBlendNone) {
        updateCurrentStyles(
          [getMixBlendClassName(mixBlend).current],
          [getMixBlendClassName({ current: value, applied: "Normal" }).current]
        );
      } else {
        updateCurrentStyles([getMixBlendClassName(mixBlend).current], []);
      }
    },
    [updateCurrentStyles, mixBlend]
  );

  const setOpacity = useCallback(
    (value: string) => {
      if (value === opacityNone || value === opacity.applied) {
        updateCurrentStyles([`opacity-${opacity.current}`], []);
      } else {
        updateCurrentStyles([`opacity-${opacity.current}`], [`opacity-${value}`]);
      }
    },
    [updateCurrentStyles, opacity]
  );

  const toggleHidden = useCallback(() => {
    const appliedValue = hidden.applied ? "invisible" : "visible";
    const newValue = hidden.current ?? hidden.applied ? "visible" : "invisible";
    if (newValue === appliedValue) {
      // This toggles the visibility to the applied value, therefore we
      // remove the visibility class
      updateCurrentStyles(["visible", "invisible"], []);
    } else {
      updateCurrentStyles(["visible", "invisible"], [newValue]);
    }
  }, [updateCurrentStyles, hidden]);

  return {
    // State
    mixBlend,
    opacity,
    hidden,
    // Methods
    setMixBlend,
    setOpacity,
    toggleHidden
  };
}
