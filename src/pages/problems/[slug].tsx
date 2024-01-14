import { Tab } from "@headlessui/react";
import { AcademicCapIcon, StarIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  ClockIcon,
  CodeBracketIcon,
  CommandLineIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";

import { Button } from "@/components/button";
import { TAB_BUTTON_CLASSNAMES, TAB_LIST_CLASSNAMES } from "@/components/tabs";
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

  const ProblemActions = (
    <div className="mt-6 flex flex-col space-y-3">
      <Button className="flex items-center justify-center py-3">
        <CodeBracketIcon className="mr-3 h-5 w-5" />
        Start in online editor
      </Button>
      <Button
        className="flex items-center justify-center py-3"
        variant="secondary"
      >
        <CommandLineIcon className="mr-3 h-5 w-5" />
        Download and work locally
      </Button>
    </div>
  );

  const ProblemHighlights = (
    <div className="mt-6 flex items-center justify-around text-slate-400">
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
      <div className="mx-auto flex max-w-6xl flex-col px-6 pb-24 pt-12  lg:flex-row lg:px-0 ">
        <div className="items-startlg:pr-6 flex flex-1 flex-col">
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
                <p className="flex items-center">
                  <FolderIcon className="mr-2 h-4 w-4 stroke-current text-indigo-500" />

                  <span>{problemSet?.name}</span>
                </p>

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

          <div className="lg:hidden">
            {ProblemHighlights}

            {ProblemActions}
          </div>

          <div className="mt-6 w-full">
            <Tab.Group manual>
              <Tab.List
                className={TAB_LIST_CLASSNAMES("sticky top-16 bg-slate-900")}
              >
                {["Project brief", "Solution", "Community submissions"].map(
                  (item) => (
                    <Tab key={item} as={Fragment}>
                      {({ selected }) => (
                        <button className={TAB_BUTTON_CLASSNAMES(selected)}>
                          {item}
                        </button>
                      )}
                    </Tab>
                  ),
                )}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div
                    className="prose prose-invert pt-6"
                    dangerouslySetInnerHTML={{ __html: problem?.brief ?? "" }}
                  ></div>
                  <div
                    className="prose prose-invert pt-6"
                    dangerouslySetInnerHTML={{ __html: problem?.brief ?? "" }}
                  ></div>
                  <div
                    className="prose prose-invert pt-6"
                    dangerouslySetInnerHTML={{ __html: problem?.brief ?? "" }}
                  ></div>
                </Tab.Panel>
                <Tab.Panel>Content 2</Tab.Panel>
                <Tab.Panel>Content 3</Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
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
