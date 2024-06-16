import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ExtensionStateProvider } from "./tailwindModel/State/ExtensionStateProvider";
import { VSCodeDivider, VSCodeButton } from "@vscode/webview-ui-toolkit/react";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ExtensionStateProvider>
      <main className="select-none flex flex-col h-full">
        <div className="flex flex-col grow overflow-y-auto overflow-x-hidden">
          <App />
        </div>
        <div className="flex flex-col grow-0">
          <VSCodeDivider />
          <div className="flex items-center justify-between p-4">
            <VSCodeButton className="w-full" disabled title="Extension is currently in beta">
              Unlicensed
            </VSCodeButton>
          </div>
        </div>
      </main>
    </ExtensionStateProvider>
  </React.StrictMode>
);
