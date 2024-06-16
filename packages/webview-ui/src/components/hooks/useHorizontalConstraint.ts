import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { type CurrentAppliedType, getCurrentAppliedType } from "../../types/general";
import {
  type HorizontalConstraintsState,
  type HorizontalConstraints,
  type HorizontalConstraintOption,
  type HorizontalSelectValue,
  isHorizontalConstraintOption
} from "../../types/constraintHorizontal";
import { useKeyboardShift } from "./useKeyboardShift";
import { useCallback } from "react";

export function useHorizontalConstraint() {
  const shift = useKeyboardShift();

  const { updateCurrentStyles, getValueByPrefix, getValueByPrefixOneOf } = useExtensionState();

  const firstConstraint = getValueByPrefixOneOf(["left", "right", "inset-x"]);
  const isInset = getIsInsetX(firstConstraint);

  const left = getValueByPrefix("left-");
  const right = getValueByPrefix("right-");
  const insetX = getValueByPrefix("inset-x-");

  const horizontalConstraints = getValidConstraints(
    {
      left,
      right,
      insetX
    },
    isInset
  );

  const horizontalOption = getHorizontalOption(horizontalConstraints);

  const horizontalConstraintValueChange = useCallback(
    (type: HorizontalSelectValue) => {
      switch (type) {
        case "left": {
          if (shift && horizontalConstraints.left.current) {
            // remove left
            updateCurrentStyles(["left-0"], []);
          } else if (horizontalConstraints.left.applied) {
            // Left is already applied
            updateCurrentStyles(["left-0"], []);
          } else {
            if (shift) {
              // Add left
              updateCurrentStyles(["inset-x-0"], ["left-0"]);
            } else {
              // Set left
              updateCurrentStyles(["right-0", "inset-x-0"], ["left-0"]);
            }
          }
          break;
        }
        case "right": {
          if (shift && horizontalConstraints.right.current) {
            // remove right
            updateCurrentStyles(["right-0"], []);
          } else if (horizontalConstraints.right.applied) {
            // Right is already applied
            updateCurrentStyles(["right-0"], []);
          } else {
            if (shift) {
              // Add right
              updateCurrentStyles(["inset-x-0"], ["right-0"]);
            } else {
              // Set right
              updateCurrentStyles(["left-0", "inset-x-0"], ["right-0"]);
            }
          }
          break;
        }
        case "insetX": {
          if (shift && horizontalConstraints.insetX.current) {
            // remove inset-x
            updateCurrentStyles(["inset-x-0"], []);
          } else if (horizontalConstraints.insetX.applied) {
            // Inset-x is already applied
            updateCurrentStyles(["inset-x-0"], []);
          } else {
            // Set inset-x
            updateCurrentStyles(["right-0", "left-0"], ["inset-x-0"]);
          }
          break;
        }
        case "left-right": {
          const addClasses = [];
          if (!horizontalConstraints.left.applied) {
            addClasses.push("left-0");
          }
          if (!horizontalConstraints.right.applied) {
            addClasses.push("right-0");
          }
          updateCurrentStyles(["right-0", "left-0", "inset-x-0"], addClasses);
          break;
        }
        case "scale-x": {
          updateCurrentStyles(["right-0", "left-0", "inset-x-0"], []);
          break;
        }
        default: {
          console.error("Unknown horizontal constraints type");
        }
      }
    },
    [shift, updateCurrentStyles, horizontalConstraints]
  );

  const horizontalConstraintOptionChange = useCallback(
    (newValue: string) => {
      if (isHorizontalConstraintOption(newValue)) {
        horizontalConstraintValueChange(getHorizontalConstraintValue(newValue));
      }
    },
    [horizontalConstraintValueChange]
  );

  return {
    // State
    horizontalConstraints,
    horizontalOption,
    // Actions
    horizontalConstraintValueChange,
    horizontalConstraintOptionChange
  };
}

export function getIsInsetX(v: CurrentAppliedType<string | undefined>) {
  // TODO: Check if this is correct
  if (v.current) {
    if (v.current.startsWith("inset")) {
      return true;
    } else if (v.current.startsWith("left")) {
      return false;
    } else if (v.current.startsWith("right")) {
      return false;
    }
  }
  if (v.applied) {
    if (v.applied.startsWith("inset")) {
      return true;
    } else if (v.applied.startsWith("left")) {
      return false;
    } else if (v.applied.startsWith("right")) {
      return false;
    }
  }
  return false;
}

function getValidConstraints(state: HorizontalConstraints, isInsetY: boolean): HorizontalConstraintsState {
  return isInsetY
    ? {
        left: getCurrentAppliedType(false),
        right: getCurrentAppliedType(false),
        insetX: {
          current: state.insetX.current != null,
          applied: state.insetX.applied != null
        }
      }
    : {
        left: {
          current: state.left.current != null,
          applied: state.left.applied != null
        },
        right: {
          current: state.right.current != null,
          applied: state.right.applied != null
        },
        insetX: getCurrentAppliedType(false)
      };
}

function getHorizontalOption(
  state: HorizontalConstraintsState
): CurrentAppliedType<HorizontalConstraintOption | undefined> {
  const current = getHorizontalConstraintOption({
    left: state.left.current || state.left.applied,
    right: state.right.current || state.right.applied,
    insetX: state.insetX.current || state.insetX.applied
  });
  const applied = getHorizontalConstraintOption({
    left: state.left.applied,
    right: state.right.applied,
    insetX: state.insetX.applied
  });

  return {
    current,
    applied
  };
}

function getHorizontalConstraintOption({
  left,
  right,
  insetX
}: {
  left: boolean;
  right: boolean;
  insetX: boolean;
}): HorizontalConstraintOption | undefined {
  if (left && right) {
    return "Left and Right";
  } else if (left) {
    return "Left";
  } else if (right) {
    return "Right";
  } else if (insetX) {
    return "Center";
  }
}

export function getHorizontalConstraintValue(horizontalOption: HorizontalConstraintOption): HorizontalSelectValue {
  switch (horizontalOption) {
    case "Left":
      return "left";
    case "Right":
      return "right";
    case "Left and Right":
      return "left-right";
    case "Center":
      return "insetX";
    case "Scale":
      return "scale-x";
  }
}
