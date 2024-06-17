import * as vscode from "vscode";
import { Decorator } from "./decorator";
import { Settings } from "./configuration";
import { BridgeProvider } from "./BridgeProvider";
import { WindCraftVisualComponentEditorProvider } from "./component-server/WindCraftVisualComponentEditorProvider";
import { activateRpcExtensionServer } from "@windcraft/ts-plugin/extension/activateRpcExtensionServer";
import { getClassNamesPosition } from "@windcraft/ts-plugin/extension/getClassNamesPosition";

const componentServerHttp = "http://localhost:5173";
const componentServerWs = "ws://localhost:5173";

export type UpdateSelectionType = "INIT" | "READY" | "COMPILED" | "SELECTION_CHANGE";

export async function activate(context: vscode.ExtensionContext) {
  console.info("WindCraft extension is now active!!");

  let nextDocumentId = 1;
  // Register the decorator
  const decorator = new Decorator();
  const bridgeProvider = new BridgeProvider(context.extensionUri);
  const componentServerProvider = WindCraftVisualComponentEditorProvider.register(
    context,
    componentServerHttp,
    componentServerWs
  );

  const rpcExtensionServer = await activateRpcExtensionServer(context);

  const skipUpdateEvent: Record<UpdateSelectionType, boolean> = {
    INIT: false,
    READY: false,
    COMPILED: false,
    SELECTION_CHANGE: false
  };

  bridgeProvider.onUpdateClassName((newClassName, newRange) => {
    // Skip COMPILED & SELECTION_CHANGE events if class name was just updated
    skipUpdateEvent.SELECTION_CHANGE = true;
    skipUpdateEvent.COMPILED = true;
    if (!newRange) {
      console.error("Replacing - updateClassName:", newClassName, newRange);
      return;
    }
    decorator.updateClassName(
      newClassName,
      new vscode.Range(
        new vscode.Position(newRange.start.line, newRange.start.character - 1),
        new vscode.Position(newRange.end.line, newRange.end.character + 1)
      )
    );
  });

  const updateSelection = async (type: UpdateSelectionType) => {
    if (skipUpdateEvent[type]) {
      // Skip if the class name was just updated for this type
      skipUpdateEvent[type] = false;
      return;
    }

    const { document, selection } = vscode.window.activeTextEditor ?? {};

    if (!document || !selection) {
      console.error("No document selection");
      return;
    }

    // Get the current class name and scope from the TypeScript server
    const classNamesFile = await rpcExtensionServer.client.getClassNames(
      document.fileName,
      document.offsetAt(selection.active)
    );

    const classNamesPosition = getClassNamesPosition(classNamesFile, document);

    console.info("Current Class Name:", classNamesPosition.current);

    if (!classNamesPosition.current) {
      await bridgeProvider.clearSelection();
      decorator.clearDecorations();
      return;
    }
    await bridgeProvider.initializeSelection(
      classNamesPosition.current,
      classNamesPosition.scope.map((c) => c.className ?? "")
    );

    decorator.updateDecorations(classNamesPosition.current, classNamesPosition.scope);

    return classNamesFile;
  };

  rpcExtensionServer.on("programCompile", async () => {
    await updateSelection("COMPILED");
  });

  bridgeProvider.onReady(async () => {
    console.log("BridgeProvider is ready");
    await updateSelection("READY");
  });

  decorator.loadConfig();
  decorator.setActiveEditor(vscode.window.activeTextEditor);
  await updateSelection("INIT");

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async () => {
      updateSelection("SELECTION_CHANGE");
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      decorator.setActiveEditor(vscode.window.activeTextEditor);
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
      bridgeProvider.clearTailwindStyles();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showPreview", () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Creating new Paw Draw files currently requires opening a workspace");
        return;
      }

      const docUri = vscode.window.activeTextEditor?.document.uri;

      const orgUri = workspaceFolders[0].uri;
      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, `new-${nextDocumentId++}.tsx`).with({
        scheme: "untitled"
      });

      console.log(uri, orgUri, docUri);

      vscode.commands.executeCommand("vscode.openWith", docUri, WindCraftVisualComponentEditorProvider.viewType);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showPreviewToSide", () => {
      //
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showTailwindView", async () => {
      await vscode.commands.executeCommand(`${BridgeProvider.viewType}.focus`);
    })
  );

  // Register the view provider

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(BridgeProvider.viewType, bridgeProvider));

  context.subscriptions.push(componentServerProvider);
}

export function deactivate(context: vscode.ExtensionContext) {
  for (const subscription of context.subscriptions) {
    subscription.dispose();
  }
}
