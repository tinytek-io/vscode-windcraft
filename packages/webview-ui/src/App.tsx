import "./css/global.css";
import "./css/utility.css";
import "./css/components.css";
import { useHasSelection } from "./components/hooks/useHasSelection";
import { GlobalSettingsPage } from "./components/pages/GlobalSettingsPage";
import { PropertiesPage } from "./components/pages/PropertiesPage";

// TODO: Build Figma like UI for editing tailwind classes
// https://code.visualstudio.com/blogs/2021/10/11/webview-ui-toolkit
// https://github.com/microsoft/vscode-webview-ui-toolkit
// https://code.visualstudio.com/api/references/theme-color
// https://react-icons.github.io/react-icons/search/#q=letter%20x
// https://code.visualstudio.com/api/extension-guides/language-model#send-the-language-model-request

document.oncontextmenu = () => false;

function App() {
  const hasSelection = useHasSelection();

  if (hasSelection) {
    return <PropertiesPage />;
  }
  return <GlobalSettingsPage />;
}

export default App;
