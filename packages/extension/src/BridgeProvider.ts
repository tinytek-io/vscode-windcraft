import * as vscode from "vscode";
import { getNonce } from "./utilities/getNonce";
import { getUri } from "./utilities/getUri";
import { ExtensionBridge } from "./bridge";

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

export class BridgeProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "windcraft.tailwindView";

  private _view?: vscode.WebviewView;
  private _selectionPosition: vscode.Position | null = null;
  private _currentSelection: string | undefined;
  private _onReadyCallback?: OnReadyCallback = undefined;

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

      localResourceRoots: [this._extensionUri],
    };

    new ExtensionBridge(webviewView, {
      isReady: async () => {
        if (this._onReadyCallback != null) {
          this._onReadyCallback();
        }
      },
      setClassName: async (className: string) => {
        return this.updateSelectionClassName(className);
      },
    });

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  onReady(onReadyCallback: OnReadyCallback) {
    this._onReadyCallback = onReadyCallback;
  }

  public async updateSelectionClassName(className: string) {
    const selectionPosition = this._selectionPosition;
    const currentSelection = this._currentSelection;

    if (selectionPosition == null || currentSelection == null) {
      throw new Error("Selection not initialized");
    }

    const oldRange = new vscode.Range(
      selectionPosition,
      new vscode.Position(
        selectionPosition.line,
        selectionPosition.character + currentSelection.length
      )
    );

    const result = await vscode.window.activeTextEditor?.edit((editBuilder) => {
      editBuilder.replace(oldRange, className);
    });

    if (!result) {
      console.error("Error updating selection");
      return;
    }

    this._currentSelection = className;

    // Update the selection state
    return className;
  }

  public async initializeSelection(data: {
    currentSelection: string | undefined;
    selectionPosition: vscode.Position;
  }) {
    if (this._view) {
      // Initialize internal state
      this._currentSelection = data.currentSelection;
      this._selectionPosition = data.selectionPosition;
      // Initialize selection value
      this._view.webview.postMessage({
        type: "INITIALIZE_SELECTION",
        value: this._currentSelection,
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
        type: "CLEAR_SELECTION",
      });
    }
  }

  public clearTailwindStyles() {
    if (this._view) {
      this._view.webview.postMessage({
        type: "CLEAR_TAILWIND_STYLES",
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const production = process.env.NODE_ENV === "production";

    const localServer = "localhost:8090";

    // The CSS file from the React build output
    const stylesUri = production
      ? getUri(webview, this._extensionUri, [
          "..",
          "..",
          "dist",
          "webview-ui",
          "static",
          "css",
          "index.css",
        ])
      : `http://${localServer}/static/css/index.css`;

    // The JS file from the React build output
    const scriptUri = production
      ? getUri(webview, this._extensionUri, [
          "..",
          "..",
          "dist",
          "webview-ui",
          "static",
          "js",
          "index.js",
        ])
      : `http://${localServer}/static/js/index.js`;

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const csp = production
      ? `default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';`
      : `default-src 'none'; style-src ${webview.cspSource} http://${localServer} 'unsafe-inline'; script-src 'nonce-${nonce}' ${webview.cspSource} http://${localServer}; connect-src 'self' ws://${localServer} http://${localServer};`;

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>WindCraft</title>
          <meta charset="UTF-8" />
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
