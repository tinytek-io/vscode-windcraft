import { Range, TextEditor } from "vscode";
import { ScopeDecorationType, CurrentDecorationType, CurrentEmptyDecorationType } from "./decorations";
import { ClassNamePosition } from "@windcraft/ts-plugin/extension/getClassNamesPosition";

const enabledLanguages = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
];

export class Decorator {
  activeEditor: TextEditor | null = null;

  currentDecorationType = CurrentDecorationType();
  currentEmptyDecorationType = CurrentEmptyDecorationType();
  scopeDecorationType = ScopeDecorationType();

  setActiveEditor(textEditor: TextEditor | undefined) {
    if (!textEditor) {
      return;
    }
    this.activeEditor = textEditor;
    this.clearDecorations();
  }

  loadConfig() {
    this.currentDecorationType.dispose();
    this.currentEmptyDecorationType.dispose();
    this.scopeDecorationType.dispose();
    this.currentDecorationType = CurrentDecorationType();
    this.currentEmptyDecorationType = CurrentEmptyDecorationType();
    this.scopeDecorationType = ScopeDecorationType();
    this.clearDecorations();
  }

  /**
   * Update the class name decoration only
   */
  updateClassName(newClassName: string | undefined, newRange: Range | undefined) {
    if (!this.activeEditor) {
      return;
    }
    if (!enabledLanguages.includes(this.activeEditor.document.languageId)) {
      return;
    }

    // Check if the current class name is empty / className is not set
    const emptyClassName = (newClassName == null && newRange?.start.compareTo(newRange.end) === 0);

    // Activate the decorations
    this.activeEditor.setDecorations(
      this.currentDecorationType,
      newRange && !emptyClassName
        ? [
            {
              range: newRange,
              hoverMessage: "Current WindCraft selection",
            },
          ]
        : []
    );
    this.activeEditor.setDecorations(
      this.currentEmptyDecorationType,
      newRange && emptyClassName
        ? [
            {
              range: newRange,
              hoverMessage: "Current WindCraft selection",
            },
          ]
        : []
    );
  }

  clearDecorations() {
    this.activeEditor?.setDecorations(this.currentDecorationType, []);
    this.activeEditor?.setDecorations(this.currentEmptyDecorationType, []);
    this.activeEditor?.setDecorations(this.scopeDecorationType, []);
  }

  /**
   * Update the scope decorations and the current class name decoration
   */
  updateDecorations(
    current: ClassNamePosition | undefined,
    scope: ClassNamePosition[]
  ) {
    if (!this.activeEditor) {
      return;
    }
    if (!enabledLanguages.includes(this.activeEditor.document.languageId)) {
      return;
    }

    this.updateClassName(current?.className, current?.range);

    this.activeEditor.setDecorations(
      this.scopeDecorationType,
      scope.map((c) => ({ range: c.range }))
    );
  }
}
