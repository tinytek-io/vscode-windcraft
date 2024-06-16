import { uniqueArray } from "../../lib/uniqueArray";
import { sortClassList } from "../designSystem";
import {
  type CustomStyle,
  type TailwindStyle,
  type TailwindValue,
  addStylesToCurrent,
  appliedTailwindStylesFilter,
  createScopedStyleState,
  createStyleState,
  currentTailwindStylesFilter,
  getTailwindValue,
  removeStylesFromCurrent,
  scopeTailwindStylesFilter
} from "../lib/styleHelpers";
import type { Action } from "./actions";

export interface StyleState {
  currentClassName: string | null;
  scopeClassNames: string[];
  customStyles: CustomStyle[];
  tailwindStyles: TailwindStyle[];
  scopeTailwindStyles: TailwindStyle[][];
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
    currentClassName: null,
    scopeClassNames: [],
    customStyles: [],
    tailwindStyles: [],
    scopeTailwindStyles: [],
    modifierState: "",
    currentTailwindStyles: [],
    appliedTailwindStyles: [],
    bothTailwindStyles: [],
    bothTailwindValues: []
  };
}

export function reducer(state: StyleState, action: Action): StyleState {
  console.log("EVENT:", action);
  switch (action.type) {
    case "CODE_DESELECTION": {
      return createInitialState();
    }
    case "CODE_SELECTION": {
      const currentClassName = action.payload.currentClassName;
      const scopeClassNames = action.payload.scopeClassNames || state.scopeClassNames || [];

      const scopeTailwindStyles = createScopedStyleState(scopeClassNames);

      const { customStyles, tailwindStyles } = createStyleState(currentClassName);
      const currentTailwindStyles = getCurrentTailwindStyles(state.modifierState, tailwindStyles);

      const appliedTailwindStyles = getAppliedTailwindStyles(state.modifierState, tailwindStyles, scopeTailwindStyles);

      const bothTailwindStyles = [...currentTailwindStyles, ...appliedTailwindStyles];

      console.log(action.type, {
        modifierState: state.modifierState,
        currentTailwindStyles,
        appliedTailwindStyles,
        scopeTailwindStyles
      });
      return {
        ...state,
        currentClassName,
        scopeClassNames,
        customStyles,
        tailwindStyles,
        scopeTailwindStyles,
        currentTailwindStyles,
        appliedTailwindStyles,
        bothTailwindStyles,
        bothTailwindValues: bothTailwindStyles.map(getTailwindValue)
      };
    }
    case "ADD_TAILWIND_STYLE": {
      return {
        ...state,
        tailwindStyles: addStylesToCurrent(state.tailwindStyles, [action.payload], state.modifierState)
      };
    }
    case "REMOVE_TAILWIND_STYLE": {
      return {
        ...state,
        tailwindStyles: removeStylesFromCurrent(state.tailwindStyles, [action.payload], state.modifierState)
      };
    }
    case "SET_MODIFIER_STATE": {
      const modifierState = action.payload;
      const currentTailwindStyles = getCurrentTailwindStyles(modifierState, state.tailwindStyles);

      const appliedTailwindStyles = getAppliedTailwindStyles(
        modifierState,
        state.tailwindStyles,
        state.scopeTailwindStyles
      );
      const bothTailwindStyles = [...currentTailwindStyles, ...appliedTailwindStyles];

      console.log(action.type, {
        modifierState,
        currentTailwindStyles,
        appliedTailwindStyles,
        scopeTailwindStyles: state.scopeTailwindStyles
      });
      return {
        ...state,
        modifierState,
        currentTailwindStyles,
        appliedTailwindStyles,
        bothTailwindStyles,
        bothTailwindValues: bothTailwindStyles.map(getTailwindValue)
      };
    }
    default:
      return state;
  }
}

function getCurrentTailwindStyles(modifierState: string, tailwindStyles: TailwindStyle[]): TailwindStyle[] {
  return uniqueArray(
    sortClassList(tailwindStyles.filter(currentTailwindStylesFilter(modifierState))).map(getTailwindValue)
  ).toReversed();
}

function getAppliedTailwindStyles(
  modifierState: string,
  tailwindStyles: TailwindStyle[],
  scopeTailwindStyles: TailwindStyle[][]
): TailwindStyle[] {
  const mergedTailwindStyles = [
    ...tailwindStyles.filter(appliedTailwindStylesFilter(modifierState)),
    ...scopeTailwindStyles.flat().filter(scopeTailwindStylesFilter(modifierState))
  ];

  return uniqueArray(sortClassList(mergedTailwindStyles).map(getTailwindValue)).toReversed();
}
