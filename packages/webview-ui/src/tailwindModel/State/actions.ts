import { TailwindModifierState, TailwindStyle } from "../lib/styleHelpers";

export type Action =
  | CodeSelection
  | CodeDeselection
  | AddTailwindStyleAction
  | RemoveTailwindStyleAction
  | SetModifierState
  | ClearTailwindStyles;

export interface CodeSelection {
  type: "CODE_SELECTION";
  payload: {
    currentClassName: string;
    scopeClassNames: string[] | null;
  };
}

export interface CodeDeselection {
  type: "CODE_DESELECTION";
}

export interface AddTailwindStyleAction {
  type: "ADD_TAILWIND_STYLE";
  payload: TailwindStyle;
}

export interface RemoveTailwindStyleAction {
  type: "REMOVE_TAILWIND_STYLE";
  payload: TailwindStyle;
}

export interface SetModifierState {
  type: "SET_MODIFIER_STATE";
  payload: TailwindModifierState;
}

export interface ClearTailwindStyles {
  type: "CLEAR_TAILWIND_STYLES";
}
