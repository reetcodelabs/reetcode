import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import * as defaultThemes from "@codesandbox/sandpack-themes";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ResizablePanels";
import { cn } from "@/lib/utils";
import {
  databaseService,
  type ProblemWithTemplate,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";

interface ProblemProps {
  problem: ProblemWithTemplate;
}

// const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"));
// const EditorPreview = dynamic(() => import("@/components/editor/Preview"));
// const EditorTests = dynamic(() => import("@/components/editor/Tests"));

function ListOfEditableFiles() {
  const { sandpack } = useSandpack();

  const listOfFiles = Object.keys(sandpack.files).map((name) => ({ name }));

  return (
    <div className="flex h-10 w-full items-center border-b border-[#444344] bg-transparent ">
      {listOfFiles.map((file) => (
        <button
          key={file.name}
          className={cn(
            "h-full px-3 transition ease-linear hover:bg-[#444344]",
            {
              "bg-[#444344]": file.name === sandpack.activeFile,
            },
          )}
          onClick={function () {
            sandpack.setActiveFile(file.name);
          }}
        >
          {file.name}
        </button>
      ))}
    </div>
  );
}

export default function ProblemEditor({ problem }: ProblemProps) {
  return (
    <SandpackProvider
      template="react-ts"
      theme={defaultThemes.monokaiPro}
      className="h-[calc(100vh-58px)]"
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} className="flex items-center">
          <div className="h-full flex-1">
            <ListOfEditableFiles />
            <SandpackCodeEditor
              className="h-full"
              showLineNumbers
              showInlineErrors
              showTabs={false}
              showRunButton
              wrapContent
              extensions={[autocompletion(), javascript()]}
            />
            {/* <MonacoEditor /> */}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <SandpackPreview className="h-full rounded-none" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SandpackProvider>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problem = await databaseService.getProblemBySlug(
      ctx.query.slug as string,
    );

    return {
      props: {
        session: ctx.req.session,
        problem,
      },
    };
  },
);
