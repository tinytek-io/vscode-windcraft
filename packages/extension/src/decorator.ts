import { Range, TextEditor } from "vscode";
import {
  UnselectedDecorationType,
  SelectedDecorationType,
} from "./decorations";

const enabledLanguages = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
];

export class Decorator {
  // Credit to tailwind-fold for the regex pattern
  // Note: We are planning to implement a more robust regex pattern in the future in form of a parser for better performance
  // and additional features.
  activeEditor: TextEditor | null = null;
  regEx =
    /(className)(?:=|:|:\s)((({\s*?.*?\()([\s\S]*?)(\)\s*?}))|(({?\s*?(['"`]))([\s\S]*?)(\8|\9\s*?})))/g;
  regExGroupsAll = [0];
  regExGroupsQuotes = [5, 10];

  selectedDecorationType = SelectedDecorationType();
  unselectedDecorationType = UnselectedDecorationType();

  unselectedRanges: Range[] = [];
  selectedRanges: Range[] = [];

  setActiveEditor(textEditor: TextEditor | undefined) {
    if (!textEditor) {
      return;
    }
    this.activeEditor = textEditor;
    this.updateDecorations();
  }

  getActiveEditor() {
    return this.activeEditor;
  }

  loadConfig() {
    this.selectedDecorationType.dispose();
    this.unselectedDecorationType.dispose();
    this.selectedDecorationType = SelectedDecorationType();
    this.unselectedDecorationType = UnselectedDecorationType();
    this.updateDecorations();
  }

  updateDecorations() {
    if (!this.activeEditor) {
      return;
    }
    if (!enabledLanguages.includes(this.activeEditor.document.languageId)) {
      return;
    }

    const documentText = this.activeEditor.document.getText();
    this.unselectedRanges = [];
    this.selectedRanges = [];

    let match;
    while ((match = this.regEx.exec(documentText))) {
      let matchedGroup;

      for (const group of this.regExGroupsAll) {
        if (match[group]) {
          matchedGroup = group;
          break;
        }
      }

      if (matchedGroup === undefined) {
        continue;
      }

      const text = match[0];
      const textMatch = match[matchedGroup];
      const textMatchIndex = text.indexOf(textMatch);

      if (textMatchIndex === -1) {
        continue;
      }

      const textMatchStartPosition = this.activeEditor.document.positionAt(
        match.index + textMatchIndex
      );
      const textMatchEndPosition = this.activeEditor.document.positionAt(
        match.index + textMatchIndex + textMatch.length
      );

      const range = new Range(textMatchStartPosition, textMatchEndPosition);
      if (this.isRangeSelected(range) || this.isLineOfRangeSelected(range)) {
        this.selectedRanges.push(range);
        continue;
      }
      this.unselectedRanges.push(range);
    }

    // Activate the decorations
    this.activeEditor.setDecorations(
      this.selectedDecorationType,
      this.selectedRanges
    );
    this.activeEditor.setDecorations(
      this.unselectedDecorationType,
      this.unselectedRanges
    );
  }

  isRangeSelected(range: Range): boolean {
    return !!(
      this.activeEditor?.selection.contains(range) ||
      this.activeEditor?.selections.find((s) => range.contains(s))
    );
  }

  isLineOfRangeSelected(range: Range): boolean {
    return !!this.activeEditor?.selections.find(
      (s) => s.start.line === range.start.line
    );
  }
}
