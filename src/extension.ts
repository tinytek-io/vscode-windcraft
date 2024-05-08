import * as vscode from "vscode";
import { Decorator } from "./decorator";
import { Settings } from "./configuration";
import { BridgeProvider } from "./BridgeProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the decorator
  const decorator = new Decorator();
  const provider = new BridgeProvider(context.extensionUri);

  decorator.loadConfig();
  decorator.setActiveEditor(vscode.window.activeTextEditor);

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      decorator.setActiveEditor(vscode.window.activeTextEditor);
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async () => {
      decorator.updateDecorations();
      if (
        decorator.unselectedRanges.length + decorator.selectedRanges.length >
        0
      ) {
        const selectionRange = decorator.selectedRanges[0];
        if (!selectionRange) {
          await provider.clearSelection();
          return;
        }
        await provider.initializeSelection({
          selectionPosition: selectionRange.start,
          currentSelection: decorator
            .getActiveEditor()
            ?.document.getText(selectionRange),
        });
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(Settings.Identifier)) {
        decorator.loadConfig();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.clearTailwindStyles", () => {
      provider.clearTailwindStyles();
    })
  );

  // Register the view provider

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(BridgeProvider.viewType, provider)
  );
}

export function deactivate(context: vscode.ExtensionContext) {
  // context.subscriptions.forEach((subscription) => subscription.dispose());
}
