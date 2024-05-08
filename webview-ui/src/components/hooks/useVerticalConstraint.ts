import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";
import { CurrentAppliedType, getCurrentAppliedType } from "../../types/general";
import {
  VerticalConstraintsState,
  VerticalConstraints,
  VerticalConstraintOption,
  VerticalSelectValue,
  isVerticalConstraintOption,
} from "../../types/constraintVertical";
import { useKeyboardShift } from "./useKeyboardShift";
import { useCallback } from "react";

export function useVerticalConstraint() {
  const shift = useKeyboardShift();

  const { updateCurrentStyles, getValueByPrefix, getValueByPrefixOneOf } =
    useExtensionState();

  const firstConstraint = getValueByPrefixOneOf(["top", "bottom", "inset-y"]);
  const isInset = getIsInsetY(firstConstraint);

  const top = getValueByPrefix("top-");
  const bottom = getValueByPrefix("bottom-");
  const insetY = getValueByPrefix("inset-y-");

  const verticalConstraints = getValidConstraints(
    {
      top,
      bottom,
      insetY,
    },
    isInset
  );

  const verticalOption = getVerticalOption(verticalConstraints);

  const verticalConstraintValueChange = useCallback(
    (type: VerticalSelectValue) => {
      switch (type) {
        case "top": {
          if (shift && verticalConstraints.top.current) {
            // remove top
            updateCurrentStyles(["top-0"], []);
          } else if (verticalConstraints.top.applied) {
            // Top is already applied
            updateCurrentStyles(["top-0"], []);
          } else {
            if (shift) {
              // Add top
              updateCurrentStyles(["inset-y-0"], ["top-0"]);
            } else {
              // Set top
              updateCurrentStyles(["bottom-0", "inset-y-0"], ["top-0"]);
            }
          }
          break;
        }
        case "bottom": {
          if (shift && verticalConstraints.bottom.current) {
            // remove bottom
            updateCurrentStyles(["bottom-0"], []);
          } else if (verticalConstraints.bottom.applied) {
            // Bottom is already applied
            updateCurrentStyles(["bottom-0"], []);
          } else {
            if (shift) {
              // Add bottom
              updateCurrentStyles(["inset-y-0"], ["bottom-0"]);
            } else {
              // Set bottom
              updateCurrentStyles(["top-0", "inset-y-0"], ["bottom-0"]);
            }
          }
          break;
        }
        case "insetY": {
          if (shift && verticalConstraints.insetY.current) {
            // remove inset-y
            updateCurrentStyles(["inset-y-0"], []);
          } else if (verticalConstraints.insetY.applied) {
            // Inset-y is already applied
            updateCurrentStyles(["inset-y-0"], []);
          } else {
            // Set inset-y
            updateCurrentStyles(["top-0", "bottom-0"], ["inset-y-0"]);
          }
          break;
        }
        case "top-bottom": {
          const addClasses = [];
          if (!verticalConstraints.top.applied) {
            addClasses.push("top-0");
          }
          if (!verticalConstraints.bottom.applied) {
            addClasses.push("bottom-0");
          }
          updateCurrentStyles(["top-0", "bottom-0", "inset-y-0"], addClasses);
          break;
        }
        case "scale-y": {
          updateCurrentStyles(["top-0", "bottom-0", "inset-y-0"], []);
          break;
        }
        default: {
          console.error("Unknown vertical constraints type");
        }
      }
    },
    [shift, updateCurrentStyles, verticalConstraints]
  );

  const verticalConstraintOptionChange = useCallback(
    (newValue: string) => {
      if (isVerticalConstraintOption(newValue)) {
        verticalConstraintValueChange(getVerticalConstraintValue(newValue));
      }
    },
    [verticalConstraintValueChange]
  );

  return {
    // State
    verticalConstraints,
    verticalOption,
    // Actions
    verticalConstraintValueChange,
    verticalConstraintOptionChange,
  };
}

export function getIsInsetY(v: CurrentAppliedType<string | undefined>) {
  if (v.current) {
    if (v.current.startsWith("inset")) {
      return true;
    } else if (v.current.startsWith("top")) {
      return false;
    } else if (v.current.startsWith("bottom")) {
      return false;
    }
  }
  if (v.applied) {
    if (v.applied.startsWith("inset")) {
      return true;
    } else if (v.applied.startsWith("top")) {
      return false;
    } else if (v.applied.startsWith("bottom")) {
      return false;
    }
  }
  return false;
}

function getValidConstraints(
  state: VerticalConstraints,
  isInsetY: boolean
): VerticalConstraintsState {
  return isInsetY
    ? {
        top: getCurrentAppliedType(false),
        bottom: getCurrentAppliedType(false),
        insetY: {
          current: state.insetY.current != null,
          applied: state.insetY.applied != null,
        },
      }
    : {
        top: {
          current: state.top.current != null,
          applied: state.top.applied != null,
        },
        bottom: {
          current: state.bottom.current != null,
          applied: state.bottom.applied != null,
        },
        insetY: getCurrentAppliedType(false),
      };
}

function getVerticalOption(
  state: VerticalConstraintsState
): CurrentAppliedType<VerticalConstraintOption | undefined> {
  const current = getVerticalConstraintOption({
    top: state.top.current || state.top.applied,
    bottom: state.bottom.current || state.bottom.applied,
    insetY: state.insetY.current || state.insetY.applied,
  });
  const applied = getVerticalConstraintOption({
    top: state.top.applied,
    bottom: state.bottom.applied,
    insetY: state.insetY.applied,
  });

  return {
    current,
    applied,
  };
}

function getVerticalConstraintOption({
  top,
  bottom,
  insetY,
}: {
  top: boolean;
  bottom: boolean;
  insetY: boolean;
}): VerticalConstraintOption | undefined {
  if (top && bottom) {
    return "Top and Bottom";
  } else if (top) {
    return "Top";
  } else if (bottom) {
    return "Bottom";
  } else if (insetY) {
    return "Center";
  }
}

export function getVerticalConstraintValue(
  verticalOption: VerticalConstraintOption
): VerticalSelectValue {
  switch (verticalOption) {
    case "Top":
      return "top";
    case "Bottom":
      return "bottom";
    case "Top and Bottom":
      return "top-bottom";
    case "Center":
      return "insetY";
    case "Scale":
      return "scale-y";
  }
}
