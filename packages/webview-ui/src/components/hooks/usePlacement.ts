import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import {
  placementNone,
  placementValues,
  placementXClasses,
  placementXPrefix,
  placementYClasses,
  placementYPrefix
} from "../../types/placement";

export function usePlacement() {
  const { updateCurrentStyles, getValueByPrefix } = useExtensionState();

  const placementX = getValueByPrefix(placementXPrefix);

  const placementY = getValueByPrefix(placementYPrefix);

  const setPlacementX = useCallback(
    (newX: string) => {
      const appliedX = placementX.applied ?? placementNone;
      if (newX === appliedX) {
        // New value is the same as the applied value, we don't need to set it again
        updateCurrentStyles(placementXClasses, []);
      } else {
        updateCurrentStyles(placementXClasses, [`${placementXPrefix}${newX}`]);
      }
    },
    [updateCurrentStyles, placementXPrefix]
  );

  const setPlacementY = useCallback(
    (newY: string) => {
      const appliedY = placementY.applied ?? placementNone;
      if (newY === appliedY) {
        // New value is the same as the applied value, we don't need to set it again
        updateCurrentStyles(placementYClasses, []);
      } else {
        updateCurrentStyles(placementYClasses, [`${placementYPrefix}${newY}`]);
      }
    },
    [updateCurrentStyles, placementYPrefix]
  );

  return {
    placementX,
    placementY,
    setPlacementX,
    setPlacementY
  };
}
