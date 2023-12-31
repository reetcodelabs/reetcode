import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  type SandpackPredefinedTemplate,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/button";
import { TestCases } from "@/components/problems/TestCases";
import { Select, type SelectOption } from "@/components/select";
import { Tabs } from "@/components/tabs";
import {
  databaseService,
  type ProblemWithTemplate,
  type TemplateWithStarterFiles,
} from "@/server/services/database";
import { axiosClient } from "@/utils/axios";
import { withIronSessionSsr } from "@/utils/session";
import { SandpackThemeKey, useSandpackTheme } from "@/hooks/useSandpackTheme";

function useWindowResized() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleWindowResized() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleWindowResized);

    return () => window.removeEventListener("resize", handleWindowResized);
  }, []);

  return size;
}

function useResize({
  initialSize = { x: 0, y: 0 },
}: {
  initialSize?: { x: number; y: number };
}) {
  const [size, setSize] = useState(initialSize);

  useEffect(() => {
    if (size.y <= 0 || size.x <= 0) {
      setSize(initialSize);
    }
  }, [initialSize]);

  const onResize = (mouseDownEvent: MouseEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      setSize(() => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }

    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return { onResize, size };
}

export function useProblemInterface() {
  const { width: windowWidth, height } = useWindowResized();

  const questionContainerHeight = height - 70;
  const defaultQuestionContainerWidth = windowWidth * 0.32; // 32% by default

  const isLoadingWindowSize = windowWidth === 0 && height === 0;

  const defaultEditorHeight = questionContainerHeight * 0.3;

  const defaultPreviewHeight =
    questionContainerHeight - defaultEditorHeight - 12;

  const { onResize, size: previewSize } = useResize({
    initialSize: { x: windowWidth, y: defaultPreviewHeight },
  });

  const { onResize: onQuestionAreaResize, size: questionAreaSize } = useResize({
    initialSize: { x: defaultQuestionContainerWidth, y: height },
  });

  const questionContainerWidth = questionAreaSize.x;
  const previewAndEditorContainerWidth = windowWidth - questionContainerWidth;

  const editorHeight = previewSize.y - 36;

  const previewHeight = questionContainerHeight - editorHeight - 16;

  return {
    previewHeight,
    editorHeight,
    previewAndEditorContainerWidth,
    questionContainerWidth,
    onQuestionAreaResize,
    questionAreaSize,
    onResize,
    previewSize,
    defaultPreviewHeight,
    isLoadingWindowSize,
    defaultQuestionContainerWidth,
    questionContainerHeight,
    windowWidth,
    height,
  };
}

function useFetchTemplateFiles() {
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTemplateFiles = useCallback(async (templateId: string) => {
    setIsFetching(true);

    try {
      const response = await axiosClient.post<TemplateWithStarterFiles>(
        "/problems/get-template-files",
        {
          templateId,
        },
      );

      setIsFetching(false);

      return response.data;
    } catch (error) {
      setIsFetching(false);
      setIsError(false);

      return null;
    }
  }, []);

  return {
    isError,
    isFetching,
    fetchTemplateFiles,
  };
}

export default function ProblemEditor({
  problem: defaultProblem,
}: {
  problem: ProblemWithTemplate;
}) {
  const [problem, setProblem] = useState<ProblemWithTemplate>(defaultProblem);
  const {
    previewHeight,
    editorHeight,
    previewAndEditorContainerWidth,
    questionContainerWidth,
    onQuestionAreaResize,
    onResize,
    isLoadingWindowSize,
    questionContainerHeight,
  } = useProblemInterface();
  const [template, setTemplate] = useState<SelectOption>(
    () =>
      problem.problemTemplates.find((template) => template.default === true)!,
  );
  const { fetchTemplateFiles } = useFetchTemplateFiles();

  async function onTemplateSelectChanged(selected: SelectOption) {
    // if starter files fetched, switch template
    const hasStarterFiles =
      problem.problemTemplates.find((t) => t.id === selected.id)
        ?.starterFiles !== undefined;

    if (hasStarterFiles) {
      setTemplate(selected);

      return;
    }

    // if not, fetch starter files then switch template
    const templateWithStarterFiles = await fetchTemplateFiles(selected.id);

    if (!templateWithStarterFiles) {
      // there was an error.
      return;
    }

    // replate template in state with one with starter files.
    setProblem((current) => ({
      ...current,
      problemTemplates: current.problemTemplates.map((template) =>
        template.id === selected.id ? templateWithStarterFiles : template,
      ),
    }));
    setTemplate(selected);
  }

  const activeTemplate = useMemo(() => {
    const activeTemplate = problem.problemTemplates.find(
      (t) => t.id === template.id,
    );

    const defaultTemplate = problem.templates?.[0];

    if (activeTemplate?.id === defaultTemplate?.id) {
      return defaultTemplate!;
    }

    return activeTemplate!;
  }, [template]);

  const { themes, setTheme, theme, sandpackThemes } = useSandpackTheme();

  const files = useMemo(() => {
    const filesMap: Record<string, string> = {};

    for (const file of activeTemplate?.starterFiles ?? []) {
      filesMap[file.path] = file.content;
    }

    return filesMap;
  }, [template]);

  if (isLoadingWindowSize) {
    return <BookOpenIcon className="h-32 w-32" />;
  }

  return (
    <SandpackProvider
      files={files}
      className="h-full"
      theme={sandpackThemes[theme?.id as SandpackThemeKey]}
      template={activeTemplate?.sandpackTemplate as SandpackPredefinedTemplate}
    >
      <div className="flex flex-col">
        <main className="flex w-full flex-1 bg-slate-800 p-2">
          <div
            className="relative transition ease-linear"
            style={{
              width: questionContainerWidth,
              height: questionContainerHeight,
            }}
          >
            <div
              className=" box-border h-full w-full overflow-y-auto rounded-lg border border-slate-50/[0.06] bg-slate-900"
              style={{ height: "calc(100vh - 4.25rem)" }}
            >
              <div
                className="absolute -right-2 z-10 h-full w-2 cursor-col-resize rounded-sm bg-indigo-500 opacity-0 transition ease-linear hover:opacity-100"
                onMouseDown={
                  onQuestionAreaResize as unknown as MouseEventHandler
                }
              ></div>
              <Tabs
                tabs={[
                  {
                    name: "Description",
                    value: "description",
                    current: true,
                    content: (
                      <div
                        className="prose prose-sm prose-invert space-y-4 p-2 text-slate-400"
                        dangerouslySetInnerHTML={{
                          __html: problem.brief ?? "",
                        }}
                      ></div>
                    ),
                  },
                  {
                    name: "Solution",
                    value: "solution",
                    current: false,
                    content: <div className="w-full"></div>,
                  },
                ]}
              />
            </div>
          </div>
          <div
            className="relative h-full pl-2"
            style={{ width: previewAndEditorContainerWidth }}
          >
            <div
              style={{ height: editorHeight }}
              className="relative mb-2 w-full overflow-y-auto rounded-lg border border-slate-50/[0.06] bg-slate-900"
            >
              <div className="absolute top-0 z-10 flex h-12 w-full items-center border-b border-slate-50/[0.06] px-2">
                <div className="flex w-full items-center">
                  <div className="w-full max-w-[12rem]">
                    <Select
                      options={themes}
                      onChange={(selected) => {
                        setTheme(selected);
                      }}
                      value={theme}
                    />
                  </div>
                </div>
                <div className="flex h-full w-full items-center justify-end gap-x-4">
                  <div className="w-full max-w-[12rem]">
                    <Select
                      options={problem.problemTemplates.map((template) => ({
                        id: template.id,
                        name: template.name,
                      }))}
                      value={template}
                      onChange={onTemplateSelectChanged}
                    />
                  </div>
                  <Button>Run code</Button>
                </div>
              </div>
              <div className="flex h-full pt-12">
                <SandpackFileExplorer className="max-w-[12rem]" />
                <SandpackCodeEditor showLineNumbers className="rounded-lg" />
              </div>
            </div>

            <div
              style={{ height: previewHeight }}
              className="relative box-border w-full rounded-lg border-2 border-slate-900 bg-slate-900"
            >
              <div
                className="absolute -top-2 h-2 w-full cursor-row-resize rounded-sm bg-indigo-500 opacity-0 transition ease-linear hover:opacity-100"
                onMouseDown={onResize as unknown as MouseEventHandler}
              ></div>
              <Tabs
                tabs={[
                  {
                    name: "Preview",
                    value: "preview",
                    current: true,
                    content: (
                      <SandpackPreview
                        className="h-full w-full rounded-lg"
                        showOpenInCodeSandbox={false}
                        style={{ height: previewHeight - 43 }}
                      />
                    ),
                  },
                  {
                    name: "Test cases",
                    value: "test cases",
                    current: false,
                    content: (
                      <div
                        className="overflow-y-auto"
                        style={{ height: previewHeight - 64 }}
                      >
                        <TestCases />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </main>
      </div>
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
