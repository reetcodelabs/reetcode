import { NavLinks, UserLinks } from "@/layouts/main";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function useResize() {
  const [size, setSize] = useState({ x: 400, y: 300 });

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

export default function Challenge() {
  //   const { onResize } = useResize();

  return (
    <div className="flex h-screen flex-col">
      <div className="sticky top-0 z-50 flex h-12 flex-shrink-0 items-center border-b bg-background px-4">
        <div className="mx-auto flex w-full max-w-6xl items-center">
          <NavLinks />
          <UserLinks />
        </div>
      </div>
      <main className="flex w-full flex-1 bg-primary-foreground p-2">
        <div className="h-full" style={{ width: "45%" }}>
          <div
            className="h-full w-full overflow-y-auto rounded-lg border bg-background"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <Tabs defaultValue="brief" className="w-full">
              <div className="sticky top-0 w-full rounded-none bg-background p-2">
                <TabsList className="">
                  <TabsTrigger value="brief">Brief</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="solution">Video Explanation</TabsTrigger>
                  <TabsTrigger value="submissions">
                    Community submissions
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="px-4 pb-4">
                <TabsContent value="brief">
                  <div className="prose prose-lg space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                      <p key={x} className="text-sm">
                        Public changelogs have become a really popular way to
                        keep people in the loop about what you’ve been working
                        on, and to stay accountable and build your shipping
                        muscles. They aren’t a new concept by any means of
                        course, but I don’t think it was until Linear started
                        publishing to their changelog site that others got
                        excited about using them almost as an alternative to a
                        company blog. Commit is our take on the modern product
                        changelog, designed as a single page website that can
                        act as both your project homepage and a feed of
                        everything you’ve been working on.
                      </p>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  Write your notes or pseudo code here.
                </TabsContent>
                <TabsContent value="solution">
                  Change your password here.
                </TabsContent>
                <TabsContent value="submissions">
                  Change your password here.
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        <div className="h-full pb-2 pl-2" style={{ width: "55%" }}>
          <SandpackProvider template="react" className="h-full">
            <div className="mb-2 h-3/5 w-full overflow-y-auto rounded-lg border bg-background">
              <div className="flex h-full">
                <SandpackFileExplorer className="max-w-[12rem]" />
                <SandpackCodeEditor showLineNumbers className="rounded-lg" />
              </div>
            </div>
            <div className="h-2/5 w-full rounded-lg border bg-background">
              <Tabs defaultValue="preview" className="w-full">
                <div className="sticky top-0 w-full rounded-lg bg-background p-2">
                  <TabsList className="">
                    <TabsTrigger value="test-cases">Test cases</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-4 pb-4">
                  <TabsContent value="test-cases">
                    <div className="prose prose-lg space-y-4">
                      Test cases here
                    </div>
                  </TabsContent>
                  <TabsContent value="preview">
                    <SandpackPreview
                      className="h-full rounded-lg"
                      showOpenInCodeSandbox={false}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </SandpackProvider>
        </div>
      </main>
    </div>
  );
}
