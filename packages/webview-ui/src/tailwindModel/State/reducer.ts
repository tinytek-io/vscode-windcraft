import { uniqueArray } from "../../lib/uniqueArray";
import { sortClassList } from "../designSystem";
import {
  CustomStyle,
  TailwindStyle,
  TailwindValue,
  addStylesToCurrent,
  appliedTailwindStylesFilter,
  createStyleState,
  currentTailwindStylesFilter,
  getTailwindValue,
  removeStylesFromCurrent,
} from "../lib/styleHelpers";
import { Action } from "./actions";

export interface StyleState {
  rawSelection: string | null;
  customStyles: CustomStyle[];
  tailwindStyles: TailwindStyle[];
  // Modifier state selection
  modifierState: string;
  // Filtered styles based on modifier state
  currentTailwindStyles: TailwindStyle[];
  // Applied styles based on modifier state - but not the current styles
  appliedTailwindStyles: TailwindStyle[];
  bothTailwindStyles: TailwindStyle[];
  bothTailwindValues: TailwindValue[];
  // UI state
}

export interface FlexLayout {
  direction: "row" | "column" | "wrap";
  justifyContent: "start" | "end" | "center" | "between" | "around";
  alignItems: "start" | "end" | "center" | "between" | "around";
  gap?: string;
}

export function createInitialState(): StyleState {
  return {
    rawSelection: null,
    customStyles: [],
    tailwindStyles: [],
    modifierState: "",
    currentTailwindStyles: [],
    appliedTailwindStyles: [],
    bothTailwindStyles: [],
    bothTailwindValues: [],
  };
}

export function reducer(state: StyleState, action: Action): StyleState {
  console.log("EVENT:", action);
  switch (action.type) {
    case "CODE_DESELECTION": {
      return createInitialState();
    }
    case "CODE_SELECTION": {
      const oldSelectionValue = action.payload;
      const { customStyles, tailwindStyles } =
        createStyleState(oldSelectionValue);
      const currentTailwindStyles = getCurrentTailwindStyles(
        state.modifierState,
        tailwindStyles
      );

      const appliedTailwindStyles = getAppliedTailwindStyles(
        state.modifierState,
        tailwindStyles
      );

      const bothTailwindStyles = [
        ...currentTailwindStyles,
        ...appliedTailwindStyles,
      ];
      return {
        ...state,
        rawSelection: oldSelectionValue,
        customStyles,
        tailwindStyles,
        currentTailwindStyles,
        appliedTailwindStyles,
        bothTailwindStyles,
        bothTailwindValues: bothTailwindStyles.map(getTailwindValue),
      };
    }
    case "ADD_TAILWIND_STYLE": {
      return {
        ...state,
        tailwindStyles: addStylesToCurrent(
          state.tailwindStyles,
          [action.payload],
          state.modifierState
        ),
      };
    }
    case "REMOVE_TAILWIND_STYLE": {
      return {
        ...state,
        tailwindStyles: removeStylesFromCurrent(
          state.tailwindStyles,
          [action.payload],
          state.modifierState
        ),
      };
    }
    case "SET_MODIFIER_STATE": {
      const modifierState = action.payload;
      const currentTailwindStyles = getCurrentTailwindStyles(
        modifierState,
        state.tailwindStyles
      );

      const appliedTailwindStyles = getAppliedTailwindStyles(
        modifierState,
        state.tailwindStyles
      );
      const bothTailwindStyles = [
        ...currentTailwindStyles,
        ...appliedTailwindStyles,
      ];
      return {
        ...state,
        modifierState,
        currentTailwindStyles,
        appliedTailwindStyles,
        bothTailwindStyles,
        bothTailwindValues: bothTailwindStyles.map(getTailwindValue),
      };
    }
    default:
      return state;
  }
}

function getCurrentTailwindStyles(
  modifierState: string,
  tailwindStyles: TailwindStyle[]
): TailwindStyle[] {
  return uniqueArray(
    sortClassList(
      tailwindStyles.filter(currentTailwindStylesFilter(modifierState))
    ).map(getTailwindValue)
  ).toReversed();
}

function getAppliedTailwindStyles(
  modifierState: string,
  tailwindStyles: TailwindStyle[]
): TailwindStyle[] {
  return uniqueArray(
    sortClassList(
      tailwindStyles.filter(appliedTailwindStylesFilter(modifierState))
    ).map(getTailwindValue)
  ).toReversed();
}
