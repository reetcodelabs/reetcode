import { BeakerIcon } from "@heroicons/react/24/outline";
import { type Problem } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import { Page } from "@/components/Page";
import {
  ProblemFilters,
  type ProblemFilterState,
} from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { databaseService } from "@/server/services/database";
import { axiosClient } from "@/utils/axios";
import { withIronSessionSsr } from "@/utils/session";

import {
  getDefaultFilterStateFromQuery,
  prepareFilterForQuery,
} from "../problems";

interface ProblemSetDetailsProps {
  problemSet: NonNullable<
    Awaited<ReturnType<typeof databaseService.getSingleProblemSet>>
  >;
  problems: Problem[];
}

export default function ProblemSetDetails({
  problems,
  problemSet,
}: ProblemSetDetailsProps) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<ProblemFilterState>(
    getDefaultFilterStateFromQuery(router.query as Record<string, string>),
  );

  const problemsQuery = useQuery<Problem[]>(["query-problems", activeFilters], {
    async queryFn() {
      const response = await axiosClient.post<Problem[]>(
        "/problems/get-all-problems",
        {
          ...prepareFilterForQuery(activeFilters),
          problemSets: {
            some: {
              slug: problemSet.slug,
            },
          },
        },
      );

      return response.data;
    },
    initialData: problems,
  });

  return (
    <Page>
      <div className="flex items-start gap-x-4 lg:gap-x-8">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded border border-slate-50/[0.06] bg-slate-800 shadow lg:h-28 lg:w-28">
          <img
            src={problemSet?.icon}
            alt={problemSet.name}
            className="h-12 w-12"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white lg:text-3xl">
            {problemSet?.name}
          </h1>

          <div className="mt-1 flex items-center gap-x-4 text-sm leading-5 text-slate-400 lg:my-4">
            <p className="flex items-center">
              <BeakerIcon className="mr-1 h-4 w-4 fill-current text-indigo-500" />

              <span>{problemSet._count?.problems} problems</span>
            </p>
          </div>

          <p className="hidden max-w-2xl text-sm text-slate-400 lg:flex">
            {problemSet?.shortDescription}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-slate-50/[0.06] bg-slate-800 p-4 text-sm text-slate-400">
        {problemSet?.longDescription}
      </div>

      <ProblemFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      <div className="rounded border border-slate-50/[0.06]">
        <ProblemList problemsQuery={problemsQuery} />
      </div>
    </Page>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problemSet = await databaseService.getSingleProblemSet(
      ctx.query.slug as string,
    );

    if (!problemSet) {
      return {
        notFound: true,
      };
    }

    const slug = problemSet.slug;

    const problemsQuery = getDefaultFilterStateFromQuery(
      ctx.query as Record<string, string>,
    );

    const problems = await databaseService.getAllProblems({
      ...prepareFilterForQuery(problemsQuery),
      problemSets: {
        some: {
          slug,
        },
      },
    });

    return {
      props: {
        session: ctx.req.session,
        problemSet,
        problems,
      },
    };
  },
);
