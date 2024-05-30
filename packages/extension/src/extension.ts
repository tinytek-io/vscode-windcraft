import * as vscode from "vscode";
import { Decorator, Selection } from "./decorator";
import { Settings } from "./configuration";
import { BridgeProvider } from "./BridgeProvider";
import { WindCraftVisualComponentEditorProvider } from "./component-server/WindCraftVisualComponentEditorProvider";
import { createTypeScriptServer } from "windcraft-ts-plugin/client/createTypeScriptServer";

const componentServerHttp = `http://localhost:5173`;
const componentServerWs = `ws://localhost:5173`;

export async function activate(context: vscode.ExtensionContext) {
  console.info("WindCraft extension is now active!!");

  const typeScriptServerApi = await createTypeScriptServer();

  console.info(`TypeScript Server Port: ${typeScriptServerApi?.port ?? "N/A"}`);

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

  const updateSelection = async () => {
    if (typeScriptServerApi) {
      const { document, selection } = vscode.window.activeTextEditor ?? {};

      if (!document || !selection) {
        console.error("No document selection");
        return;
      }

      const classNames = await typeScriptServerApi.getClassNames(
        document.fileName,
        document.offsetAt(selection.active)
      );
      console.info("TypeScript Server Response:", classNames);

      if (!classNames) {
        return;
      }

      const currentClassName =
        classNames.classNames[classNames.classNames.length - 1];
      console.info("Current Class Name:", currentClassName);

      const currentSelection: Selection | undefined =
        currentClassName != null
          ? {
              currentSelection: currentClassName.className,
              selectionPosition: document.positionAt(
                currentClassName.position.start
              ),
            }
          : undefined;

      if (!currentSelection) {
        await provider.clearSelection();
        decorator.updateDecorations([], []);
        return;
      }
      await provider.initializeSelection(currentSelection);

      const ranges = classNames.classNames.map(
        (c) =>
          new vscode.Range(
            document.positionAt(c.position.start),
            document.positionAt(c.position.end)
          )
      );

      const selectedRanges = [ranges.pop()!];

      decorator.updateDecorations(selectedRanges, ranges);

      return classNames;
    }
  };

  if (typeScriptServerApi) {
    typeScriptServerApi.addEventListener("programCompile", async () => {
      console.info("Program Compiled Event...");
      await updateSelection();
    });
  }

  provider.onReady(async () => {
    console.log("BridgeProvider is ready");
    await updateSelection();
  });

  decorator.loadConfig();
  decorator.setActiveEditor(vscode.window.activeTextEditor);
  await updateSelection();

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      decorator.setActiveEditor(vscode.window.activeTextEditor);
    })
  );

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(async () => {
      await updateSelection();
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

  context.subscriptions.push(
    vscode.commands.registerCommand("windcraft.showTailwindView", async () => {
      await vscode.commands.executeCommand(`${BridgeProvider.viewType}.focus`);
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
