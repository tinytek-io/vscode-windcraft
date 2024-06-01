import { Range, TextEditor, Position, DecorationOptions } from "vscode";
import { ScopeDecorationType, CurrentDecorationType, CurrentEmptyDecorationType } from "./decorations";
import { ClassNamePosition } from "windcraft-ts-plugin/client/classNameFile";

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

  clearDecorations() {
    this.activeEditor?.setDecorations(this.currentDecorationType, []);
    this.activeEditor?.setDecorations(this.currentEmptyDecorationType, []);
    this.activeEditor?.setDecorations(this.scopeDecorationType, []);
  }

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

    // Check if the current class name is empty / className is not set
    const emptyClassName = (current?.className === "" && current.position.start === current.position.end);

    // Activate the decorations
    this.activeEditor.setDecorations(
      this.currentDecorationType,
      current && !emptyClassName
        ? [
            {
              range: current.range,
              hoverMessage: "Current WindCraft selection",
            },
          ]
        : []
    );
    this.activeEditor.setDecorations(
      this.currentEmptyDecorationType,
      current && emptyClassName
        ? [
            {
              range: current.range,
              hoverMessage: "Current WindCraft selection",
            },
          ]
        : []
    );
    this.activeEditor.setDecorations(
      this.scopeDecorationType,
      scope.map((c) => ({ range: c.range }))
    );
  }
}
