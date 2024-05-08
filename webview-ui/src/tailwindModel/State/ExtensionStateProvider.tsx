import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { StyleState, createInitialState, reducer } from "./reducer";
import { Action } from "./actions";
import { TailwindStyle, addStylesToCurrent, createClassName, removeStylesFromCurrent } from "../lib/styleHelpers";
import { bridge } from "../../utilities/Bridge";
import { ColorName, parseColorName } from "../../types/color";
import { OptionalTailwindStyle, CurrentAppliedType, KeySuffixMap, UIValue, TailwindSuffix } from "../../types/general";

export interface ExtensionState {
  styleState: StyleState;
}

export interface ExtensionStateContextType extends ExtensionState {
  dispatch: React.Dispatch<Action>;
  /**
   * Update the current styles in the class name of the selected element
   * @param removeStyles - Tailwind styles to remove
   * @param addStyles - Tailwind styles to add
   */
  updateCurrentStyles: (removeStyles: OptionalTailwindStyle[], addStyles: OptionalTailwindStyle[]) => void;
  /**
   * Check if a value is an exact match for a tailwind class
   * e.g. "bg-red-500" hasExactValue("bg-red-500") => true
   */
  hasExactValue: (value: string) => CurrentAppliedType<boolean>;
  /**
   * Match a tailwind class suffix to a UI value based on a prefix and a KeySuffixMap
   */
  getBySuffix: (prefix: string, kv: KeySuffixMap) => CurrentAppliedType<UIValue | undefined>;
  /**
   * Get a tailwind class suffix based on a prefix
   * e.g. "bg-red-500" getValueByPrefix("bg-") => "red-500"
   */
  getValueByPrefix: (prefix: string, not?: string[]) => CurrentAppliedType<TailwindSuffix | undefined>;
  /**
   * Get a tailwind class based on a list of options
   * e.g. getValueOneOf(["bg-red-500", "bg-blue-500"]) => "bg-red-500" or "bg-blue-500" or undefined
   * 
   * Note: endOfStyles is an optional parameter that can be used to stop the search at a specific style
   */
  getValueOneOf: (options: string[], endOfStyles?: string) => CurrentAppliedType<UIValue | undefined>;
  /**
   * Get a tailwind class based on a list of prefixes
   * e.g. getValueOneOf(["bg-red-", "bg-blue-"]) => "bg-red-500" or "bg-blue-500" or undefined
   */
  getValueByPrefixOneOf: (options: string[]) => CurrentAppliedType<UIValue | undefined>;
  /**
   * Get a color name based on a prefix
   * e.g. getColorByPrefix("bg-") => "red-500" or "blue-500/50" or undefined
   */
  getColorByPrefix: (prefix: string, not?: string[]) => CurrentAppliedType<ColorName | undefined>;
}

export const ExtensionStateContext = createContext<ExtensionStateContextType>({
  styleState: createInitialState(),
  dispatch: () => { },
  updateCurrentStyles: () => { },
  hasExactValue: () => ({ current: false, applied: false }),
  getBySuffix: () => ({ current: undefined, applied: undefined }),
  getValueByPrefix: () => ({ current: undefined, applied: undefined }),
  getValueOneOf: () => ({ current: undefined, applied: undefined }),
  getValueByPrefixOneOf: () => ({ current: undefined, applied: undefined }),
  getColorByPrefix: () => ({ current: undefined, applied: undefined }),
});

type ExtensionStateProviderProps = {
  children: React.ReactNode;
};

export function ExtensionStateProvider({
  children,
}: Readonly<ExtensionStateProviderProps>) {
  const [styleState, dispatch] = useReducer(reducer, createInitialState());

  const updateCurrentStyles = useCallback(
    async (removeStyles: OptionalTailwindStyle[], addStyles: OptionalTailwindStyle[]) => {
      const removedStyles = removeStylesFromCurrent(styleState.tailwindStyles, removeStyles.filter(Boolean) as TailwindStyle[], styleState.modifierState);
      const addedStyles = addStylesToCurrent(removedStyles, addStyles.filter(Boolean) as TailwindStyle[], styleState.modifierState);
      const className = createClassName({
        customStyles: styleState.customStyles,
        tailwindStyles: addedStyles,
      });

      console.log(`Call remote method: "${className}"`);
      const result = await bridge.remoteMethods.setClassName(className);
      console.log(`Remote method result: "${result}"`);

      if (result !== undefined) {
        dispatch({
          type: "CODE_SELECTION",
          payload: result,
        });
      } else {
        console.error("Error setting class name");
      }
    },
    [styleState]
  );

  const clearTailwindStyles = useCallback(() => {
    updateCurrentStyles(styleState.tailwindStyles, []);
  }, [styleState.tailwindStyles, updateCurrentStyles]);

  const hasExactValue: ExtensionStateContextType["hasExactValue"] = useCallback(
    (value: string) => ({
      current: hasExactValueStyle(styleState.currentTailwindStyles, value),
      applied: hasExactValueStyle(styleState.appliedTailwindStyles, value),
    }),
    [styleState]
  );

  const getBySuffix: ExtensionStateContextType["getBySuffix"] = useCallback(
    (prefix: string, kv: KeySuffixMap) => ({
      current: getBySuffixStyle(styleState.currentTailwindStyles, prefix, kv),
      applied: getBySuffixStyle(styleState.appliedTailwindStyles, prefix, kv),
    }),
    [hasExactValue]
  );

  const getValueByPrefix: ExtensionStateContextType["getValueByPrefix"] = useCallback(
    (prefix: string, not: string[] = []) => ({
      current: getValueByPrefixStyle(styleState.currentTailwindStyles, prefix, not),
      applied: getValueByPrefixStyle(styleState.appliedTailwindStyles, prefix, not),
    }), [styleState]
  );

  const getColorByPrefix: ExtensionStateContextType["getColorByPrefix"] = useCallback(
    (prefix: string, not: string[] = []) => ({
      current: getColorByPrefixStyle(styleState.currentTailwindStyles, prefix, not),
      applied: getColorByPrefixStyle(styleState.appliedTailwindStyles, prefix, not),
    }), [styleState]
  );

  const getValueOneOf: ExtensionStateContextType["getValueOneOf"] = useCallback(
    (options: string[], endOfStyles?: string) => ({
      current: getValueOneOfStyle(styleState.currentTailwindStyles, options, endOfStyles),
      applied: getValueOneOfStyle(styleState.appliedTailwindStyles, options, endOfStyles),
    }),
    [styleState]
  );

  const getValueByPrefixOneOf: ExtensionStateContextType["getValueByPrefixOneOf"] = useCallback(
    (prefixes: string[]) => ({
      current: getValueByPrefixOneOfStyle(styleState.currentTailwindStyles, prefixes),
      applied: getValueByPrefixOneOfStyle(styleState.appliedTailwindStyles, prefixes),
    }),
    [styleState]
  );

  useEffect(() => {
    function handleSelectionChange(event: MessageEvent<any>) {
      const message = event.data; // The json data that the extension sent
      switch (message.type) {
        case "INITIALIZE_SELECTION": {
          console.log(`Initialized selection: "${message.value}"`);
          try {
            dispatch({
              type: "CODE_SELECTION",
              payload: message.value,
            });
          } catch (error) {
            console.error("Error parsing selection update payload", error);
          }
          break;
        }
        case "CLEAR_SELECTION": {
          console.log("Cleared selection");
          dispatch({
            type: "CODE_DESELECTION",
          });
          break;
        }
        case "CLEAR_TAILWIND_STYLES": {
          console.log("Cleared tailwind styles");
          clearTailwindStyles();
          break;
        }
      }
    }

    window.addEventListener("message", handleSelectionChange);
    return () => {
      window.removeEventListener("message", handleSelectionChange);
    };
  }, [dispatch, clearTailwindStyles]);

  const value = useMemo(
    () => ({
      styleState,
      dispatch,
      updateCurrentStyles,
      hasExactValue,
      getBySuffix,
      getValueByPrefix,
      getValueOneOf,
      getValueByPrefixOneOf,
      getColorByPrefix,
    }),
    [styleState, dispatch, updateCurrentStyles]
  );

  return (
    <ExtensionStateContext.Provider value={value}>
      {children}
    </ExtensionStateContext.Provider>
  );
}

export function useExtensionState() {
  return useContext(ExtensionStateContext);
}

function getValueOneOfStyle(styles: TailwindStyle[], options: string[], endOfStyles: string = "") {
  const indexOfEnd = styles.indexOf(endOfStyles);
  const haystack = indexOfEnd === -1 ? styles : styles.slice(0, indexOfEnd + 1);
  return haystack.find((s) => options.includes(s));
}

function getValueByPrefixOneOfStyle(styles: TailwindStyle[], prefixes: string[]) {
  return styles.find((s) => prefixes.find(p => s.startsWith(p)));
}

function getColorByPrefixStyle(styles: TailwindStyle[], prefix: string, not: string[] = []) {
  return styles
    .find((s) => s.startsWith(prefix) && !not.some(n => s.startsWith(n)) && parseColorName(s.slice(prefix.length)) != null)
    ?.slice(prefix.length) as ColorName | undefined;
}

function getValueByPrefixStyle(styles: TailwindStyle[], prefix: string, not: string[] = []) {
  return styles
    .find((s) => s.startsWith(prefix) && !not.some(n => s.startsWith(n)))
    ?.slice(prefix.length);
}

function getBySuffixStyle(styles: TailwindStyle[], prefix: string, kv: KeySuffixMap) {
  for (const [key, suffix] of kv.entries()) {
    if (hasExactValueStyle(styles, `${prefix}${suffix}`)) {
      return key;
    }
  }
  return undefined;
}

function hasExactValueStyle(styles: TailwindStyle[], value: string) {
  return styles.includes(value);
}
