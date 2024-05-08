import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { useCallback } from "react";
import { rotationNone, rotationPrefix, rotationClasses } from "../../types/rotation";


export function useRotation() {
  const { getValueByPrefix, updateCurrentStyles } = useExtensionState();

  const rotation = getValueByPrefix(rotationPrefix);

  const setRotation = useCallback((option: string) => {
    const appliedAngle = rotation.applied ?? rotationNone;
    const newAngle = option.replace(/\D/g, ""); // remove the degree symbol
    if (newAngle === appliedAngle) {
      // New value is the same as the applied value
      updateCurrentStyles(rotationClasses, []);
    } else {
      // New value is different from the applied value
      updateCurrentStyles(
        rotationClasses,
        [`${rotationPrefix}${newAngle}`]
      );
    }
  }, [updateCurrentStyles, rotation]);

  return {
    rotation,
    setRotation,
  };
}
