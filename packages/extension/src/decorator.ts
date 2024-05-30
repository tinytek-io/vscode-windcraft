import { Range, TextEditor, Position } from "vscode";
import { ScopeDecorationType, CurrentDecorationType } from "./decorations";
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
    this.scopeDecorationType.dispose();
    this.currentDecorationType = CurrentDecorationType();
    this.scopeDecorationType = ScopeDecorationType();
    this.clearDecorations();
  }

  clearDecorations() {
    this.activeEditor?.setDecorations(this.currentDecorationType, []);
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

    // Activate the decorations
    this.activeEditor.setDecorations(
      this.currentDecorationType,
      current
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
