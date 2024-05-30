import { useExtensionState } from "../../tailwindModel/State/ExtensionStateProvider";

export function useHasSelection() {
  const { styleState } = useExtensionState();
  return styleState.currentClassName !== null;
}
