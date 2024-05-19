import { useCallback } from "react";
import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";

export type PositionType = "absolute" | "relative" | "fixed" | "sticky";
export const positionValues: Readonly<PositionType[]> = [
  "absolute",
  "relative",
  "fixed",
  "sticky",
];

export function usePosition() {
  const { getValueOneOf, updateCurrentStyles } = useExtensionState();
  const position = getValueOneOf([...positionValues]);
  const hasPosition = (position.current ?? position.applied) !== undefined;
  const setPosition = useCallback(
    (value?: PositionType | undefined) => {
      const x = 0; // TODO: Add support for x and y
      const y = 0;
      const coordValues = [
        `top-${y}`,
        `left-${x}`,
        `right-${x}`,
        `bottom-${y}`,
        `inset-x-${x}`,
        `inset-y-${y}`,
        `inset-${x}`,
      ];
      const allClasses = [...positionValues, ...coordValues];
      if (position.applied === value || !value) {
        updateCurrentStyles(allClasses, []);
      } else {
        updateCurrentStyles(allClasses, [value]);
      }
    },
    [updateCurrentStyles, position]
  );

  return {
    // State
    position,
    hasPosition,
    // Actions
    setPosition,
  };
}
