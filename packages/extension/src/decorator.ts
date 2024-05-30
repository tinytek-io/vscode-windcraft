import { Range, TextEditor, Position } from "vscode";
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

export type Selection = {
  selectionPosition: Position;
  currentSelection: string | undefined;
};

export class Decorator {
  activeEditor: TextEditor | null = null;

  selectedDecorationType = SelectedDecorationType();
  unselectedDecorationType = UnselectedDecorationType();

  unselectedRanges: Range[] = [];
  selectedRanges: Range[] = [];

  setActiveEditor(textEditor: TextEditor | undefined) {
    if (!textEditor) {
      return;
    }
    this.activeEditor = textEditor;
    this.updateDecorations([], []);
  }

  loadConfig() {
    this.selectedDecorationType.dispose();
    this.unselectedDecorationType.dispose();
    this.selectedDecorationType = SelectedDecorationType();
    this.unselectedDecorationType = UnselectedDecorationType();
    this.updateDecorations([], []);
  }

  updateDecorations(selectedRanges: Range[], unselectedRanges: Range[]) {
    if (!this.activeEditor) {
      return;
    }
    if (!enabledLanguages.includes(this.activeEditor.document.languageId)) {
      return;
    }

    this.selectedRanges = selectedRanges;
    this.unselectedRanges = unselectedRanges;

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
}
