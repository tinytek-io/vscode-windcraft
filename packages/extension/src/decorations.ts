import { DecorationRangeBehavior, window } from "vscode";

export function CurrentDecorationType() {
  return window.createTextEditorDecorationType({
    rangeBehavior: DecorationRangeBehavior.ClosedOpen,
    // backgroundColor: "var(--vscode-editor-selectionBackground)",
    border: "1px solid var(--vscode-interactive-activeCodeBorder)",
    borderRadius: "2px",
    cursor: "pointer",
  });
}

export function ScopeDecorationType() {
  return window.createTextEditorDecorationType({
    // backgroundColor: "var(--vscode-editor-inactiveSelectionBackground)",
    border: "1px solid var(--vscode-interactive-inactiveCodeBorder)",
    borderRadius: "2px",
    cursor: "pointer",
  });
}
