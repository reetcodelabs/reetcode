import {
  SandpackCodeEditor,
  SandpackConsole,
  type SandpackFiles,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ResizablePanels";
import { Select } from "@/components/select";
import { QUERY_BREAKPOINTS, useMediaQuery } from "@/hooks/useMediaQuery";
import Academic from "@/iconoir/academic.svg";
import Community from "@/iconoir/community.svg";
import EmptyPage from "@/iconoir/empty-page.svg";
import Eye from "@/iconoir/eye.svg";
import MediaVideoList from "@/iconoir/media-video-list.svg";
import TerminalTag from "@/iconoir/terminal-tag.svg";
import Tube from "@/iconoir/tube.svg";
import { cn } from "@/lib/utils";
import { useClientIronSession } from "@/providers/SessionProvider";
import { type ProblemWithTemplate } from "@/server/services/database";
import { axiosClient } from "@/utils/axios";

import { FakeTabs } from "../FakeTabs";
import { MonacoEditor } from "../problems/MonacoEditor";
import { TestCases } from "../problems/TestCases";

function ListOfEditableFiles({
  template,
}: {
  template: ProblemWithTemplate["template"];
}) {
  const { sandpack } = useSandpack();

  const listOfFiles = Object.keys(sandpack.files).map((name) => ({ name }));

  const tabs = listOfFiles
    .filter(
      (file) =>
        template?.hiddenFiles?.filter((hiddenFile: string) =>
          file.name.includes(hiddenFile),
        ).length === 0,
    )
    .map((file) => ({
      key: file.name,
      title: file.name,
      active: file.name === sandpack.activeFile,
      icon: () => <EmptyPage className="mr-3" />,
    }));

  return (
    <PanelTabs
      tabs={tabs}
      onTabSelected={(tab: PanelTab) => sandpack.setActiveFile(tab.title)}
    />
  );
}

interface PanelTab {
  key: string;
  title: string;
  active?: boolean;
  icon?: () => React.ReactNode;
}

interface PanelTabsProps {
  tabs: PanelTab[];
  onTabSelected?: (tab: PanelTab) => void;
}

function PanelTabs({ tabs, onTabSelected }: PanelTabsProps) {
  const activeTab = tabs.find((tab) => tab.active);

  return (
    <>
      <div className="sticky top-0 z-[2] hidden h-10 w-full flex-shrink-0 items-center border-b border-r border-slate-50/[0.06] bg-slate-900 md:flex xl:h-12">
        {tabs.map((tab) => {
          return (
            <button
              key={tab.key}
              className={cn(
                "flex h-full items-center px-3  text-white transition ease-linear hover:bg-slate-50/[0.06]",
                {
                  "border-l border-r border-slate-50/[0.06] bg-slate-50/[0.06]":
                    tab.active,
                },
              )}
              onClick={() => onTabSelected?.(tab)}
            >
              {tab?.icon?.()}
              {tab.title?.split("/")?.[1]}
            </button>
          );
        })}
      </div>

      <div className="sticky top-0 z-[2] h-10 w-full md:hidden xl:h-12">
        <Select
          options={tabs.map((tab) => ({
            id: tab.key,
            name: tab.title,
            ...tab,
          }))}
          onChange={(selected) =>
            onTabSelected?.(tabs.find((tab) => tab.key === selected.id)!)
          }
          value={
            activeTab ? { id: activeTab.key, name: activeTab.title } : undefined
          }
        />
      </div>
    </>
  );
}

interface EditorPanelsProps {
  problem: ProblemWithTemplate;
  template: ProblemWithTemplate["template"];
}
export const LOCAL_STORAGE_CACHE_KEY = (
  problemId: string,
  templateId: string,
) => `problem-${problemId}-${templateId}`;

export function EditorPanels({ problem, template }: EditorPanelsProps) {
  const [showPanels, setShowPanels] = useState(false);

  const isMdDevice = useMediaQuery(QUERY_BREAKPOINTS.MD);
  const {
    sandpack: { files, updateFile },
  } = useSandpack();

  const [debouncedFiles] = useDebounce(files, 2000);

  const { session } = useClientIronSession();

  const saveSolutionMutation = useMutation({
    async mutationFn() {
      if (!session?.user) {
        localStorage.setItem(
          LOCAL_STORAGE_CACHE_KEY(
            problem.id!,
            template?.id as unknown as string,
          ),
          JSON.stringify(debouncedFiles),
        );

        return;
      }

      await axiosClient.post("/problems/save-solution/", {
        files: Object.keys(debouncedFiles).map((file) => ({
          path: file,
          code: debouncedFiles[file]?.code,
        })),
        problemId: problem.id,
        templateId: template?.id,
      });
    },
  });

  useEffect(() => {
    setShowPanels(true);

    if (session?.user) {
      return;
    }

    const localFileCache = localStorage.getItem(
      LOCAL_STORAGE_CACHE_KEY(problem.id!, template?.id as unknown as string),
    );

    try {
      if (localFileCache) {
        updateFile(JSON.parse(localFileCache) as SandpackFiles);
      }
    } catch (error) {}
  }, []);

  function handleSandpackFileChanges() {
    saveSolutionMutation.mutate();
  }

  useEffect(() => {
    if (showPanels) {
      handleSandpackFileChanges();
    }
  }, [debouncedFiles]);

  if (!showPanels) {
    return null;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-grow">
      <ResizablePanel
        minSize={0}
        defaultSize={isMdDevice ? 35 : 100}
        className="flex flex-col"
      >
        <div className="flex h-full w-full flex-col overflow-y-auto">
          <FakeTabs
            tabs={[
              {
                title: "Description",
                key: "description",
                icon: () => <Academic className="mr-2" />,
              },
              {
                title: "Solution",
                key: "solution",
                icon: () => <MediaVideoList className="mr-2" />,
              },
              {
                title: "Comments",
                key: "comments",
                icon: () => <Community className="mr-2" />,
              },
            ]}
          >
            {({ classNames }) => (
              <>
                <div className={`${classNames("description")} overflow-y-auto`}>
                  <div
                    className="prose prose-invert mx-auto w-full max-w-none flex-grow px-6 pb-16 pt-6"
                    dangerouslySetInnerHTML={{ __html: problem?.brief ?? "" }}
                  ></div>
                </div>
                <div className={classNames("solution")}>
                  Watch the solution video here.
                </div>
                <div className={classNames("comments")}>
                  Read comments from other hackers here.
                </div>
              </>
            )}
          </FakeTabs>
        </div>
      </ResizablePanel>
      <ResizableHandle className="text-white" withHandle />
      <ResizablePanel minSize={0} defaultSize={isMdDevice ? 65 : 0}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={30} defaultSize={40}>
            <div className="h-full flex-1">
              <ListOfEditableFiles template={template} />
              <SandpackCodeEditor
                className="h-full"
                showLineNumbers
                showInlineErrors
                showTabs={false}
                showRunButton
                wrapContent
                // extensions={[autocompletion(), javascript()]}
              />
              <MonacoEditor />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="text-white" />
          <ResizablePanel minSize={30} defaultSize={60}>
            <FakeTabs
              tabs={[
                {
                  title: "Preview",
                  key: "preview",
                  icon: () => <Eye className="mr-3" />,
                },
                {
                  title: "Console",
                  key: "console",
                  icon: () => <TerminalTag className="mr-3" />,
                },
                {
                  title: "Tests",
                  key: "tests",
                  icon: () => <Tube className="mr-3" />,
                },
              ]}
            >
              {({ classNames }) => (
                <>
                  <div className={classNames("preview")}>
                    <SandpackPreview
                      showNavigator
                      showOpenInCodeSandbox={false}
                      style={{ height: "calc(100% - 48px)" }}
                    />
                  </div>
                  <div className={classNames("console")}>
                    <SandpackConsole style={{ height: "calc(100% - 48px)" }} />
                  </div>
                  <div className={classNames("tests")}>
                    <TestCases problem={problem} template={template} />
                  </div>
                </>
              )}
            </FakeTabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default EditorPanels;
