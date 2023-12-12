import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackTheme,
} from "@codesandbox/sandpack-react";
import { MouseEventHandler, useEffect, useState } from "react";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/button";
import { Select } from "@/components/select";
import * as sandpackThemes from "@codesandbox/sandpack-themes";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { TestCases } from "@/components/problems/TestCases";

const themes = [
  {
    id: "atomDark",
    name: "Atom Dark",
  },
  {
    id: "nightOwl",
    name: "Night Owl",
  },
  {
    id: "amethyst",
    name: "Amethyst",
  },
  {
    id: "aquaBlue",
    name: "Aqua Blue",
  },
  {
    id: "cobalt2",
    name: "Cobalt 2",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
  },
  {
    id: "dracula",
    name: "Dracula",
  },
  {
    id: "ecoLight",
    name: "Ecolight",
  },
  {
    id: "freeCodeCampDark",
    name: "Freecodecamp Dark",
  },
  {
    id: "githubLight",
    name: "Github Light",
  },
  {
    id: "gruvboxDark",
    name: "Gruvbox Dark",
  },
  {
    id: "gruvboxLight",
    name: "Gruvbox Light",
  },
  {
    id: "levelUp",
    name: "Level Up",
  },
  {
    id: "monokaiPro",
    name: "Monokai Pro",
  },
  {
    id: "neoCyan",
    name: "Neo Cyan",
  },

  {
    id: "sandpackDark",
    name: "Sandpack Dark",
  },
];

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
      setSize((currentSize) => ({
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

export default function ProblemEditor() {
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

  const [theme, setTheme] = useState<SandpackTheme>(
    sandpackThemes.sandpackDark,
  );

  if (isLoadingWindowSize) {
    return <BookOpenIcon className="h-32 w-32" />;
  }

  return (
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
              onMouseDown={onQuestionAreaResize as unknown as MouseEventHandler}
            ></div>
            <Tabs
              tabs={[
                {
                  name: "Description",
                  value: "description",
                  current: true,
                  content: (
                    <div className="prose prose-sm prose-invert space-y-4 p-2 text-slate-400">
                      <>
                        <h2 className="group scroll-mt-28">Solution</h2>
                        <h3 className="group scroll-mt-28">
                          Config / API Design
                        </h3>
                        <p>
                          Part of the complexity of building a component is
                          designing the API for it. The <code>accordion</code>{" "}
                          function accepts a root element, <code>$rootEl</code>,
                          where the accordion sections will be inserted. The
                          second parameter of the <code>accordion</code>{" "}
                          function is an object used to store the configuration
                          options. At the bare minimum, we will need the
                          following options:
                        </p>
                        <ul>
                          <li>
                            <code>items</code>: A list of item objects. Each
                            item is an object with the fields:
                            <ul>
                              <li>
                                <code>value</code>: A unique identifier for the
                                accordion item.
                              </li>
                              <li>
                                <code>title</code>: The text label to show in
                                the accordion title.
                              </li>
                              <li>
                                <code>contents</code>: The contents to show when
                                the section is expanded.
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <p>
                          Unlike our typical Vanilla JS approach, we opt not to
                          keep any state in JavaScript this time round and
                          instead rely on the DOM to track each accordion
                          section's state and expand/collapse the appropriate
                          elements based on that accordion's state.
                        </p>
                        <p>
                          The <code>accordion</code> function calls the{" "}
                          <code>init</code> and <code>attachEvents</code>{" "}
                          functions to set up the accordion component by
                          rendering the DOM elements and attaching the necessary
                          event listeners.
                        </p>
                        <h3 className="group scroll-mt-28">
                          <code>init</code>
                        </h3>
                        <p>
                          This function sets up the DOM elements that remain
                          throughout the lifecycle of the component, aka they
                          will never be destroyed. The accordion's sections
                          (titles and contents) are rendered.
                        </p>
                        <h3 className="group scroll-mt-28">
                          <code>attachEvents</code>
                        </h3>
                        <p>
                          Only a single event listener is necessary in this
                          component, which is the <code>click</code> event, to
                          be added to the root element. We make use of Event
                          Delegation so that only a single event listener has to
                          be added and will work for all of its child contents.
                          However, we have to be careful about checking which
                          element is being clicked on and make sure we're only
                          responding when the title is clicked and not the
                          contents.
                        </p>
                        <p>
                          When a click is triggered on the accordion title,
                          we'll need to rotate the icon and toggle the{" "}
                          <code>hidden</code> attribute on the accordion
                          contents.
                        </p>
                        <h2>Test Cases</h2>
                        <ul>
                          <li>
                            All the provided sections should be displayed.
                          </li>
                          <li>
                            Clicking on a collapsed section's title should
                            expand it.
                          </li>
                          <li>
                            Clicking on an expanded section's title should
                            collapse it.
                          </li>
                          <li>
                            Test that all sections are allowed to expand and
                            collapse independently.
                          </li>
                          <li>
                            Test that you are able to initialize multiple
                            instances of the component, each with independent
                            states.
                          </li>
                        </ul>
                        <h2>Accessibility</h2>
                        <p>
                          Interactive elements need to be focusable, so we'll
                          use a <code>&lt;button&gt;</code> for the title.
                        </p>
                        <p>
                          The{" "}
                          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion">
                            ARIA Authoring Practices Guide for Accordion
                          </a>{" "}
                          has a long list of guidelines for the ARIA roles,
                          states, and properties to add to the various elements
                          of an accordion.{" "}
                          <a href="/questions/user-interface/accordion-ii">
                            Accordion II
                          </a>{" "}
                          and{" "}
                          <a href="/questions/user-interface/accordion-iii">
                            Accordion III
                          </a>{" "}
                          will focus on improving the accessibility of the
                          Accordion component.
                        </p>
                      </>
                    </div>
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
          <SandpackProvider template="react" className="h-full" theme={theme}>
            <div
              style={{ height: editorHeight }}
              className="relative mb-2 w-full overflow-y-auto rounded-lg border border-slate-50/[0.06] bg-slate-900"
            >
              <div className="absolute top-0 z-10 flex h-12 w-full items-center border-b border-slate-50/[0.06] px-2">
                <div className="w-full max-w-[12rem]">
                  <Select
                    options={themes}
                    onChange={(selected) => {
                      setTheme(
                        sandpackThemes[
                          selected.id as keyof typeof sandpackThemes
                        ],
                      );
                    }}
                  />
                </div>
                <div className="flex h-full w-full items-center justify-end gap-x-4">
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
              className="relative box-border w-full overflow-y-auto rounded-lg border-2 border-slate-900 bg-slate-900"
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
                    content: <TestCases />,
                  },
                ]}
              />
            </div>
          </SandpackProvider>
        </div>
      </main>
    </div>
  );
}
