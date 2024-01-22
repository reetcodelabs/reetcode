import { autocompletion } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import * as defaultThemes from "@codesandbox/sandpack-themes";

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

export default function ProblemEditor({ problem }: ProblemProps) {
  return (
    <>
      {/* <Tab.Group manual>
        <Tab.List
          className={TAB_LIST_CLASSNAMES(
            "sticky top-12 h-10 bg-slate-900 text-sm",
          )}
        >
          {["Project brief", "Solution", "Community submissions"].map(
            (item) => (
              <Tab key={item} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={TAB_BUTTON_CLASSNAMES(selected, "text-sm")}
                  >
                    {item}
                  </button>
                )}
              </Tab>
            ),
          )}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <CodeEditor />
          </Tab.Panel>
          <Tab.Panel>
            <EditorPreview />
          </Tab.Panel>
          <Tab.Panel>
            <EditorTests />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group> */}
      <SandpackProvider template="react-ts" theme={defaultThemes.amethyst}>
        <div className="flex h-[calc(100vh-50px)] w-full bg-red-500">
          <div className="relative flex w-[55%]">
            <div className="relative h-full w-[256px] flex-shrink-0">
              <SandpackFileExplorer className="h-full" />
              <button className="absolute right-0 top-0 bg-green-200 p-1">
                Collapse
              </button>
            </div>
            <div className="h-full flex-1">
              <SandpackCodeEditor
                className="h-full"
                showLineNumbers
                showInlineErrors
                showTabs={false}
                showRunButton
                wrapContent
                extensions={[autocompletion(), javascript()]}
              />
            </div>
          </div>
          <div className="flex w-[45%] flex-col bg-blue-500">
            <div className="h-[60%] bg-gray-600">
              <SandpackPreview className="h-full rounded-none" />
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </SandpackProvider>
      {/* <Sandpack template="react-ts" options={{ showConsole: true }} /> */}
      {/* <SandpackProvider template="nextjs" className="h-full">
        <div className="flex flex-col">
          <main className="flex w-full flex-1 bg-slate-800 p-2"></main>
        </div>
      </SandpackProvider> */}
    </>
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
