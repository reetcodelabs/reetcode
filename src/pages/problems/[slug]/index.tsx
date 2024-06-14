import { AcademicCapIcon, StarIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  ClockIcon,
  CodeBracketIcon,
  CommandLineIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/button";
import { DownloadProblemAndWorkLocally } from "@/components/problems/DownloadProblemAndWorkLocally";
import { StartProblemInOnlineEditor } from "@/components/problems/StartProblemInOnlineEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import {
  databaseService,
  type ProblemWithTemplate,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";

interface ProblemProps {
  problem: ProblemWithTemplate;
}

export default function Problem({ problem }: ProblemProps) {
  const problemSet = problem?.problemSets?.[0];
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [startInOnlineEditor, setStartInOnlineEditor] = useState(false);

  const ProblemActions = (
    <div className="mt-6 flex w-full flex-col space-y-3">
      <Button
        className="flex w-full items-center justify-center py-3 lg:w-auto"
        onClick={() => setStartInOnlineEditor(true)}
      >
        <CodeBracketIcon className="mr-3 h-5 w-5" />
        Start in online editor
      </Button>
      <Button
        className="flex items-center justify-center py-3"
        variant="secondary"
        onClick={() => setDownloadModalOpen(true)}
      >
        <CommandLineIcon className="mr-3 h-5 w-5" />
        Download and work locally
      </Button>
    </div>
  );

  const ProblemHighlights = (
    <div className="mt-6 flex w-full items-center justify-around text-slate-400">
      <div className="flex flex-col items-center">
        <div className="mb-2 flex items-center text-white">
          <StarIcon className="mr-1.5 h-6 w-6 fill-current text-yellow-400" />{" "}
          <span className="mt-1 text-xl font-bold">5</span>
        </div>
        <span className="text-xs">12 reviews</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="mb-2 flex items-center text-white">
          <AcademicCapIcon className="mr-1.5 h-6 w-6 fill-current text-purple-400" />{" "}
          <span className="mt-1 text-xl font-bold">37</span>
        </div>
        <span className="text-xs">total completions</span>
      </div>
    </div>
  );

  return (
    <>
      <DownloadProblemAndWorkLocally
        problem={problem}
        isOpen={downloadModalOpen}
        setIsOpen={setDownloadModalOpen}
      />
      <StartProblemInOnlineEditor
        problem={problem}
        isOpen={startInOnlineEditor}
        setIsOpen={setStartInOnlineEditor}
      />
      <div className="mx-auto flex max-w-6xl flex-col px-6 pb-24 pt-12  lg:flex-row lg:px-0 ">
        <div className="flex flex-1 flex-col items-start lg:pr-6">
          <div className="flex gap-x-4 lg:gap-x-8">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded border border-slate-50/[0.06] bg-slate-800 shadow lg:h-40 lg:w-40">
              <img
                className="h-6 w-6 lg:h-16 lg:w-16"
                src={problemSet?.icon}
                alt={`Problem set: ${problemSet?.name}`}
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white lg:text-3xl">
                {problem?.name}
              </h1>

              <div className="mt-1 flex items-center gap-x-4 text-sm leading-5 text-slate-400 lg:my-4">
                <Link
                  href={`/problem-sets/${problemSet?.slug}`}
                  className="underline-offset-1 transition-all hover:underline"
                >
                  <p className="flex items-center">
                    <FolderIcon className="mr-2 h-4 w-4 stroke-current text-indigo-500" />

                    <span>{problemSet?.name}</span>
                  </p>
                </Link>

                <p className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 stroke-current text-blue-500" />

                  <span>{problem?.completionDuration} mins</span>
                </p>
              </div>

              <p className="mt-2 hidden max-w-2xl text-sm text-slate-400 lg:flex">
                {problem?.description}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-slate-50/[0.06] bg-slate-800 p-4 text-sm text-slate-400">
            {problem?.description}
          </div>

          <div className="w-full lg:hidden">
            {ProblemHighlights}

            {ProblemActions}
          </div>

          <div className="mt-6 w-full">
            <Tabs defaultValue={"brief"}>
              <TabsList>
                <TabsTrigger value="brief">Project brief</TabsTrigger>
              </TabsList>
              <TabsContent value="brief">
                <div
                  className="prose prose-invert pt-6"
                  dangerouslySetInnerHTML={{ __html: problem?.brief ?? "" }}
                ></div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="sticky mt-6 hidden w-full flex-shrink-0 self-start rounded-lg border border-slate-700 p-6 shadow-lg lg:top-28 lg:mt-0 lg:block lg:w-96">
          <div className="relative h-[198px] w-full rounded-lg border border-slate-700 bg-slate-200"></div>

          {ProblemHighlights}

          {ProblemActions}

          <ul className="mt-6 flex flex-col space-y-1">
            {[
              "4 starter templates",
              "Detailed solution video",
              "TS / Vue / React / JS / NextJS",
              4,
              5,
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center text-sm text-slate-400"
              >
                <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-slate-700"></div>
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
