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
        <App />
        <div className="flex flex-col" style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}>
          <VSCodeDivider />
          <div className="flex items-center justify-between p-4">
            Unlicensed freemium version <VSCodeButton>Buy</VSCodeButton>
          </div>
        </div>
      </main>
    </ExtensionStateProvider>
  </React.StrictMode>
);
