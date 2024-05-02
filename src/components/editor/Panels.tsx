import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  useSandpack,
  useSandpackClient,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";

import { cn } from "@/lib/utils";

import { QUERY_BREAKPOINTS, useMediaQuery } from "@/hooks/useMediaQuery";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ResizablePanels";
import { Select } from "@/components/select";

import TerminalTag from "@/iconoir/terminal-tag.svg";
import EmptyPage from "@/iconoir/empty-page.svg";
import Eye from "@/iconoir/eye.svg";
import Tube from "@/iconoir/tube.svg";
import Community from "@/iconoir/community.svg";
import Academic from "@/iconoir/academic.svg";
import MediaVideoList from "@/iconoir/media-video-list.svg";
import { ProblemWithTemplate } from "@/server/services/database";
import { useEffect, useState } from "react";
import { TestCases } from "../problems/TestCases";
import { FakeTabs } from "../FakeTabs";

function ListOfEditableFiles() {
  const { sandpack } = useSandpack();

  const listOfFiles = Object.keys(sandpack.files).map((name) => ({ name }));

  const tabs = listOfFiles.map((file) => ({
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
                "flex h-full items-center px-3 text-sm text-white transition ease-linear hover:bg-slate-50/[0.06]",
                {
                  "border-l border-r border-slate-50/[0.06] bg-slate-50/[0.06]":
                    tab.active,
                },
              )}
              onClick={() => onTabSelected?.(tab)}
            >
              {tab?.icon?.()}
              {tab.title}
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
}

export function EditorPanels({ problem }: EditorPanelsProps) {
  const [showPanels, setShowPanels] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const isMdDevice = useMediaQuery(QUERY_BREAKPOINTS.MD);

  const sandpack = useSandpack();
  const sandpackClient = useSandpackClient();
  const sandpackNavigation = useSandpackNavigation();

  console.log({ sandpackNavigation, sandpack, sandpackClient });

  useEffect(() => {
    setShowPanels(true);
  }, []);

  if (!showPanels) {
    return null;
  }

  return (
    <ResizablePanelGroup direction="horizontal">
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
            {({ activeTab, classNames }) => (
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
              <ListOfEditableFiles />
              <SandpackCodeEditor
                className="h-full"
                showLineNumbers
                showInlineErrors
                showTabs={false}
                showRunButton
                wrapContent
                // extensions={[autocompletion(), javascript()]}
              />
              {/* <MonacoEditor /> */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="text-white" />
          <ResizablePanel minSize={30} defaultSize={60}>
            {/* <Tabs
              onValueChange={(selected) => {
                if (selected === "preview") {
                  sandpack.sandpack.runSandpack();
                }
              }}
              defaultValue="preview"
              className="h-full w-full overflow-y-auto"
            >
              <TabsList className="sticky top-0 z-[100]">
                <TabsTrigger value="preview">
                  <Eye className="mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="console">
                  <Tube className="mr-2" />
                  Console
                </TabsTrigger>
                <TabsTrigger value="tests">
                  <Tube className="mr-2" />
                  Tests
                </TabsTrigger>
              </TabsList>
              <TabsContent value="console" className="h-[88%]">
                <SandpackConsole />
              </TabsContent>
              <TabsContent value="preview" className="h-[88%]">
                <SandpackPreview
                  className="h-full rounded-none"
                  showOpenInCodeSandbox={false}
                />
              </TabsContent>
              <TabsContent value="tests" className="overflow-y-auto">
                <TestCases />
              </TabsContent>
            </Tabs> */}

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
              {({ activeTab, classNames }) => (
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
                    <TestCases />
                  </div>
                </>
              )}
            </FakeTabs>

            {/* <PanelTabs
              tabs={[
                {
                  title: "Preview",
                  active: true,
                  key: "preview",
                  icon: () => <Eye className="mr-3" />,
                },
                {
                  title: "Tests",
                  active: false,
                  key: "tests",
                  icon: () => <Tube className="mr-3" />,
                },
              ]}
            /> */}
            {/* <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div> */}
            {/* <SandpackPreview className="h-full rounded-none" /> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default EditorPanels;
