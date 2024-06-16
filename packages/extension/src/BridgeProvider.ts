import * as vscode from "vscode";
import { getNonce } from "./utilities/getNonce";
import { getUri } from "./utilities/getUri";
import { ExtensionBridge } from "./bridge";
import { ClassNamePosition } from "@windcraft/ts-plugin/extension/getClassNamesPosition";

export interface Position {
  line: number;
  character: number;
}

export type Range = [Position, Position];

export type UpdateMessage = {
  type: "SET_CURRENT_CLASS_NAME";
  newSelectionValue: string;
  oldSelectionValue: string;
  selectionPosition: Position;
};

type OnReadyCallback = () => void;

export type UpdateClassNameCallback = (className: string | undefined, range: vscode.Range) => void;

export class BridgeProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "windcraft.tailwindView";

  private _view?: vscode.WebviewView;
  private _selectionPosition: vscode.Position | null = null;
  private _currentSelection: string | undefined;
  private _onReadyCallback?: OnReadyCallback = undefined;

  private _updateClassNameCallback: UpdateClassNameCallback | undefined;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri]
    };

    new ExtensionBridge(webviewView, {
      isReady: async () => {
        if (this._onReadyCallback != null) {
          this._onReadyCallback();
        }
      },
      setClassName: async (className: string) => {
        return this.updateSelectionClassName(className);
      }
    });

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  onReady(onReadyCallback: OnReadyCallback) {
    this._onReadyCallback = onReadyCallback;
  }

  onUpdateClassName(callback: UpdateClassNameCallback | undefined) {
    this._updateClassNameCallback = callback;
  }

  private async updateSelectionClassName(className: string, quote: string = '"') {
    if (this._selectionPosition == null) {
      throw new Error("Selection not initialized");
    }

    const currentSelection = this._currentSelection;

    const currentRange = new vscode.Range(
      this._selectionPosition,
      new vscode.Position(
        this._selectionPosition.line,
        this._selectionPosition.character + (currentSelection?.length ?? 0)
      )
    );

    const result = await vscode.window.activeTextEditor?.edit((editBuilder) => {
      const literalStringRange = new vscode.Range(
        new vscode.Position(currentRange.start.line, currentRange.start.character - 1),
        new vscode.Position(currentRange.end.line, currentRange.end.character + 1)
      );

      const literalString = vscode.window.activeTextEditor?.document.getText(literalStringRange);

      const message = `Replacing ${literalString} with "${className}" - "${currentSelection}" -> "${className}"`;
      if (currentSelection == null && currentRange.start.isEqual(currentRange.end)) {
        const insertPosition = new vscode.Position(currentRange.start.line, currentRange.start.character + 1);

        // If there is no selection, insert the class name
        editBuilder.insert(insertPosition, ` className=${quote}${className}${quote}`);
        // Note: We don't need to call the updateClassNameCallback here
        // depend on the TypeScript server to update the class name.
      } else if (/["'`]$/.test(literalString ?? "")) {
        // Verify that the current selection is a literal string e.g. ["flex flex-row"]
        if (currentSelection === className) {
          // Warn about no change
          console.warn(message);
        }
        editBuilder.replace(currentRange, className);
        try {
          // Call the updateClassNameCallback to update the class name decoration
          // This resembles optimistic updates as waiting for the TypeScript server
          // response can take a while
          this._updateClassNameCallback?.(className, currentRange);
        } catch (error) {
          throw new Error(`Error updateClassNameCallback: ${error}`);
        }
      } else {
        // Log error for invalid selection e.g. ["flex flex-row]
        // TODO: Fixing this issue requires a more complex solution
        console.error(message);
      }
    });

    if (!result) {
      console.error("Error updating selection");
      return;
    }

    this._currentSelection = className;

    // Update the selection state
    return className;
  }

  public async initializeSelection({ className, literalRange }: ClassNamePosition, scopeClassNames: string[]) {
    if (this._view) {
      // Initialize internal state
      this._currentSelection = className;
      this._selectionPosition = literalRange.start;
      // Initialize selection value
      this._view.webview.postMessage({
        type: "INITIALIZE_SELECTION",
        currentClassName: this._currentSelection,
        scopeClassNames
      });
    }
  }

  public async clearSelection() {
    if (!this._currentSelection || !this._selectionPosition) {
      // Nothing to clear
      return;
    }

    // Clear internal state
    this._currentSelection = undefined;
    this._selectionPosition = null;
    if (this._view) {
      this._view.webview.postMessage({
        type: "CLEAR_SELECTION"
      });
    }
  }

  public clearTailwindStyles() {
    if (this._view) {
      this._view.webview.postMessage({
        type: "CLEAR_TAILWIND_STYLES"
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const production = process.env.NODE_ENV === "production";

    const localServer = "localhost:8090";

    // The CSS file from the React build output
    const stylesUri = production
      ? getUri(webview, this._extensionUri, ["dist", "webview-ui", "static", "css", "index.css"])
      : `http://${localServer}/static/css/index.css`;

    // The JS file from the React build output
    const scriptUri = production
      ? getUri(webview, this._extensionUri, ["dist", "webview-ui", "static", "js", "index.js"])
      : `http://${localServer}/static/js/index.js`;

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const csp = production
      ? `default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';`
      : `default-src 'none'; style-src ${webview.cspSource} http://${localServer} 'unsafe-inline' 'nonce-${nonce}'; script-src 'nonce-${nonce}' ${webview.cspSource} http://${localServer}; connect-src 'self' ws://${localServer} http://${localServer};`;

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>WindCraft</title>
          <meta charset="UTF-8" />
          <meta property="csp-nonce" content="${nonce}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="${csp}">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
