import * as vscode from "vscode";
import { Decorator } from "./decorator";
import { Settings } from "./configuration";
import { BridgeProvider } from "./BridgeProvider";
import { WindCraftVisualComponentEditorProvider } from "./component-server/WindCraftVisualComponentEditorProvider";
import { activateTypeScript, getTypeScriptSymbols } from "./typescript";

const componentServerHttp = `http://localhost:5173`;
const componentServerWs = `ws://localhost:5173`;

export async function activate(context: vscode.ExtensionContext) {
  await activateTypeScript(context);

  let nextDocumentId = 1;
  // Register the decorator
  const decorator = new Decorator();
  const provider = new BridgeProvider(context.extensionUri);
  const componentServerProvider =
    WindCraftVisualComponentEditorProvider.register(
      context,
      componentServerHttp,
      componentServerWs
    );


  provider.onReady(async () => {
    console.log("BridgeProvider is ready");
    await updateSelection();
  });

  decorator.loadConfig();
  decorator.setActiveEditor(vscode.window.activeTextEditor);

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      decorator.setActiveEditor(vscode.window.activeTextEditor);
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async () => {
      await getTypeScriptSymbols();
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

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showPreview", () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "Creating new Paw Draw files currently requires opening a workspace"
        );
        return;
      }

      const docUri = vscode.window.activeTextEditor?.document.uri;

      const orgUri = workspaceFolders[0].uri;
      const uri = vscode.Uri.joinPath(
        workspaceFolders[0].uri,
        `new-${nextDocumentId++}.tsx`
      ).with({ scheme: "untitled" });

      console.log(uri, orgUri, docUri);

      vscode.commands.executeCommand(
        "vscode.openWith",
        docUri,
        WindCraftVisualComponentEditorProvider.viewType
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showPreviewToSide", () => {
      //
    })
  );

  // Register the view provider

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(BridgeProvider.viewType, provider)
  );

  context.subscriptions.push(componentServerProvider);
}

export function deactivate(context: vscode.ExtensionContext) {
  // context.subscriptions.forEach((subscription) => subscription.dispose());
}
