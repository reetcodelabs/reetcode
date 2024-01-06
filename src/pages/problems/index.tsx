import { type Difficulty, type Problem } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  ProblemFilters,
  type ProblemFilterState,
  QUERY_PARAMS_DELIMITER,
} from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { SectionHeading } from "@/components/SectionHeading";
import ProblemSets from "@/seed/problem-sets.json";
import { databaseService } from "@/server/services/database";
import { axiosClient } from "@/utils/axios";
import { withIronSessionSsr } from "@/utils/session";

const recommendedProblemSets = ProblemSets.slice(0, 4);

const stats = [
  { name: "Completed problems", stat: 13, subtitle: "of 43 problems" },
  {
    name: "Completed quizzes",
    stat: 3,
    subtitle: "of 13 quizzes",
  },
  {
    name: "Completed videos",
    stat: 2,
    subtitle: "of 13 solutions",
  },
];

interface ProblemsProps {
  problems: Problem[];
}

export default function Problems({ problems = [] }: ProblemsProps) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<ProblemFilterState>(
    getDefaultFilterStateFromQuery(router.query as Record<string, string>),
  );

  const problemsQuery = useQuery<Problem[]>(["query-problems", activeFilters], {
    async queryFn() {
      const response = await axiosClient.post<Problem[]>(
        "/problems/get-all-problems",
        prepareFilterForQuery(activeFilters),
      );

      return response.data;
    },
    initialData: problems,
  });

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pb-48 pt-12 xl:px-0">
      <section className="flex w-full flex-col">
        <SectionHeading
          title="Your progress"
          description={`You've solved a total of 13 out of the 27 problems on reetcode so far. Keep going!`}
          // link={{ title: "Explore all problem sets", href: "/" }}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="w-full rounded-lg border border-slate-50/[0.06] bg-slate-800 p-4"
            >
              <h3 className="text-base font-normal text-white">{stat.name}</h3>
              <div className="mt-2 flex items-baseline text-2xl font-semibold text-indigo-400">
                {stat.stat}
                <span className="ml-2 text-sm font-medium text-slate-400">
                  {stat.subtitle}
                </span>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col">
        <SectionHeading
          title="Recommended problem sets"
          description="Want to learn how to solve a specific type of problem? Pick a problem set and see a range of problems."
          link={{ title: "Explore all problem sets", href: "/problem-sets" }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendedProblemSets.map((problemSet) => (
            <ProblemSetCard key={problemSet?.slug} {...problemSet} />
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col">
        <ProblemFilters
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <div className="mt-6 rounded border border-slate-50/[0.06]">
          <ProblemList problemsQuery={problemsQuery} />
        </div>
      </section>
    </div>
  );
}

export function getDefaultFilterStateFromQuery(
  query: Record<"difficulty" | "careerPath", string>,
): ProblemFilterState {
  return {
    difficulty: {
      in: (query?.difficulty?.split(QUERY_PARAMS_DELIMITER) ??
        []) as Difficulty[],
    },
    careerPath: {
      slug: {
        in: query?.careerPath?.split(QUERY_PARAMS_DELIMITER) ?? [],
      },
    },
  };
}

export function prepareFilterForQuery(activeFilters: ProblemFilterState) {
  const careerPathStateIsEmpty =
    activeFilters?.careerPath?.slug?.in.length === 0;

  const difficultyStateIsEmpty = activeFilters.difficulty?.in.length === 0;

  return {
    difficulty: difficultyStateIsEmpty ? undefined : activeFilters.difficulty,
    careerPath: careerPathStateIsEmpty ? undefined : activeFilters.careerPath,
  };
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problemsQuery = getDefaultFilterStateFromQuery(
      ctx.query as Record<string, string>,
    );

    const problems = await databaseService.getAllProblems(
      prepareFilterForQuery(problemsQuery),
    );

    return {
      props: {
        session: ctx.req.session,
        problems,
      },
    };
  },
);
