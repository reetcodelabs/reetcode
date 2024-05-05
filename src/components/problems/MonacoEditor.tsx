import {
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";

export function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  function getEditorLanguage() {
    if (sandpack.activeFile.endsWith("html")) {
      return "html";
    }

    if (sandpack.activeFile.endsWith("tsx")) {
      return "jsx";
    }

    if (sandpack.activeFile.endsWith("json")) {
      return "json";
    }

    if (sandpack.activeFile.endsWith("css")) {
      return "css";
    }

    return "javascript";
  }

  const isReadOnly = sandpack.activeFile === "/package.json";

  console.log(sandpack.activeFile, isReadOnly);

  return (
    <Editor
      height="100%"
      defaultValue={code}
      theme="vs-dark"
      beforeMount={(monaco) => {
        emmetCSS(monaco);
        emmetHTML(monaco);
        emmetJSX(monaco);
      }}
      key={sandpack.activeFile}
      language={getEditorLanguage()}
      defaultLanguage={getEditorLanguage()}
      onChange={(value) => (isReadOnly ? {} : updateCode(value ?? ""))}
    />
  );
}
