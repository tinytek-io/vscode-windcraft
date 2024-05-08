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

export class BridgeProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "windcraft.tailwindView";

  private _view?: vscode.WebviewView;
  private _selectionPosition: vscode.Position | null = null;
  private _currentSelection: string | undefined;
  private _currentClassName: "class" | "className" = "class";
  private _highlightedClassName = ["!outline-blue-500", "!outline-2"];

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
      setClassName: async (className: string) => {
        return this.updateSelectionClassName(className);
      },
    });

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  public async updateSelectionClassName(className: string) {
    const selectionPosition = this._selectionPosition;
    const currentSelection = this._currentSelection;

    if (selectionPosition == null || currentSelection == null) {
      throw new Error("Selection not initialized");
    }
    const newSelectionValue = `${this._currentClassName}="${className}"`;

    const oldRange = new vscode.Range(
      selectionPosition,
      new vscode.Position(
        selectionPosition.line,
        selectionPosition.character + currentSelection.length
      )
    );

    const result = await vscode.window.activeTextEditor?.edit((editBuilder) => {
      editBuilder.replace(oldRange, newSelectionValue);
    });

    if (!result) {
      console.error("Error updating selection");
      return;
    }

    this._currentSelection = newSelectionValue;

    // Update the selection state
    return className;
  }

  private getCurrentSelectionWithoutHighlight() {
    const { value } = getClassNameFromSelection(this._currentSelection);
    if (!value) {
      return;
    }
    return value
      .split(" ")
      .filter((v) => !this._highlightedClassName.includes(v))
      .join(" ");
  }

  private getCurrentSelectionWithHighlight() {
    const value = this.getCurrentSelectionWithoutHighlight();
    if (!value) {
      return;
    }
    return [value, ...this._highlightedClassName].filter(Boolean).join(" ");
  }

  public async initializeSelection(data: {
    currentSelection: string | undefined;
    selectionPosition: vscode.Position;
  }) {
    if (this._view) {
      const { type, value } = getClassNameFromSelection(data.currentSelection);

      // Remove blue outline from previous selection
      /*if (
        this._currentSelection &&
        this._selectionPosition &&
        this._currentClassName
      ) {
        await this.updateSelectionClassName(
          this.getCurrentSelectionWithoutHighlight() ?? ""
        );
      }
      */

      // Initialize internal state
      this._currentClassName = type;
      this._currentSelection = data.currentSelection;
      this._selectionPosition = data.selectionPosition;

      // Add blue outline to new selection
      /*await this.updateSelectionClassName(
        this.getCurrentSelectionWithHighlight() ?? ""
      );*/

      // Initialize selection value
      this._view.webview.postMessage({
        type: "INITIALIZE_SELECTION",
        value: getClassNameFromSelection(this._currentSelection).value,
      });
    }
  }

  public async clearSelection() {
    if (!this._currentSelection || !this._selectionPosition) {
      // Nothing to clear
      return;
    }
    // Remove blue outline from previous selection
    /*await this.updateSelectionClassName(
      this.getCurrentSelectionWithoutHighlight() ?? ""
    );
    */

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
    const stylesUri = getUri(webview, this._extensionUri, [
      "webview-ui",
      "dist",
      "static",
      "css",
      "index.css",
    ]);

    // The JS file from the React build output
    const scriptUri = production
      ? getUri(webview, this._extensionUri, [
          "webview-ui",
          "dist",
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

function getClassNameFromSelection(selection: string | undefined): {
  type: "class" | "className";
  value?: string;
} {
  if (selection?.startsWith('className="')) {
    return { type: "className", value: selection.slice(11, -1) };
  }

  if (selection?.startsWith('class="')) {
    return { type: "class", value: selection.slice(7, -1) };
  }

  return { type: "class" };
}
