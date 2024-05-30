import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";

export class WindCraftVisualComponentEditorProvider
  implements vscode.CustomTextEditorProvider
{
  public static register(
    context: vscode.ExtensionContext,
    componentServerHost: string,
    componentServerWebSocketHost: string
  ): vscode.Disposable {
    const provider = new WindCraftVisualComponentEditorProvider(
      context,
      componentServerHost,
      componentServerWebSocketHost
    );
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      WindCraftVisualComponentEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  public static readonly viewType = "windcraft.componentView";

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly _componentServerHost: string,
    private readonly _componentServerWebSocketHost: string
  ) {}

  /**
   * Called when our custom editor is opened.
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    function updateWebview() {
      webviewPanel.webview.postMessage({
        type: "update",
        text: document.getText(),
      });
    }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage((e) => {
      switch (e.type) {
        case "add":
          return;

        case "delete":
          return;
      }
    });

    updateWebview();
  }

  /**
   * Get the static html used for the editor webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // The CSS file from the React build output
    const stylesUri = `${this._componentServerHost}/static/css/index.css`;

    // The JS file from the React build output
    const scriptUri = `${this._componentServerHost}/static/js/index.js`;

    const hostRootUri = `${this._componentServerHost}`;

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const csp = [
      `default-src 'none';`,
      `style-src ${webview.cspSource} ${this._componentServerHost} 'unsafe-inline';`,
      `script-src 'nonce-${nonce}' ${webview.cspSource} ${this._componentServerHost};`,
      `connect-src 'self' ${this._componentServerWebSocketHost} ${this._componentServerHost};`,
    ].join(" ");

    return `
    <!doctype html>
    <html lang="en">
      <head>
        <script type="module">import { injectIntoGlobalHook } from "${hostRootUri}/@react-refresh";
    injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;</script>
    
        <script type="module"  nonce="${nonce}" src="${hostRootUri}/@vite/client"></script>
    
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="${hostRootUri}/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module"  nonce="${nonce}" src="${hostRootUri}/src/main.tsx"></script>
      </body>
    </html>
  `;
  }
}

/**
<!doctype html>
<html lang="en">
  <head>
    <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>

    <script type="module" src="/@vite/client"></script>

    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

 */
