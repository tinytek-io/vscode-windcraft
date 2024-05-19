import { DecorationRangeBehavior, window } from "vscode";

export function SelectedDecorationType() {
  return window.createTextEditorDecorationType({
    rangeBehavior: DecorationRangeBehavior.ClosedOpen,
    outline: "1px solid var(--vscode-interactive-activeCodeBorder)", // --vscode-focusBorder
    borderRadius: "2px",
    cursor: "pointer",
  });
}

export function UnselectedDecorationType() {
  return window.createTextEditorDecorationType({
    outline: "1px solid var(--vscode-interactive-inactiveCodeBorder)",
    borderRadius: "2px",
    cursor: "pointer",
  });
}
