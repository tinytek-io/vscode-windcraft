import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ExtensionStateProvider } from "./tailwindModel/State/ExtensionStateProvider";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ExtensionStateProvider>
      <App />
    </ExtensionStateProvider>
  </React.StrictMode>
);
