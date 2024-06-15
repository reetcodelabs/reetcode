import { type Difficulty, type Problem } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import {
  ProblemFilters,
  type ProblemFilterState,
  QUERY_PARAMS_DELIMITER,
} from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useClientIronSession } from "@/providers/SessionProvider";
import ProblemSets from "@/seed/problem-sets.json";
import {
  databaseService,
  type SelectedAllProblemSets,
} from "@/server/services/database";
import { axiosClient } from "@/utils/axios";
import { withIronSessionSsr } from "@/utils/session";

const recommendedProblemSets = ProblemSets.slice(0, 4);

interface ProblemsProps {
  problems: Problem[];
  progress: {
    totalProblems: number;
    completedProblems: number;
    percentageCompleted: number;
  };
}

export default function Problems({ problems = [], progress }: ProblemsProps) {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<ProblemFilterState>(
    getDefaultFilterStateFromQuery(router.query as Record<string, string>),
  );
  const [clientQueryActive, setClientQueryActive] = useState(false);

  const { session } = useClientIronSession();

  useEffect(() => {
    if (clientQueryActive) return;

    const filtersChanged = defaultFiltersChanged(
      router.query as Record<string, string>,
      activeFilters,
    );

    if (filtersChanged) {
      setClientQueryActive(true);
    }
  }, [activeFilters]);

  const problemsQuery = useQuery<Problem[]>(
    ["problems-page-query-problems", activeFilters],
    {
      async queryFn() {
        const response = await axiosClient.post<Problem[]>(
          "/problems/get-all-problems",
          prepareFilterForQuery(activeFilters),
        );

        return response.data;
      },
      initialData: problems,
      enabled: clientQueryActive,
    },
  );

  const list = useMemo(() => {
    if (clientQueryActive) {
      return [...problemsQuery.data];
    }

    return [...problems];
  }, [clientQueryActive, problemsQuery]);

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pb-48 pt-12 xl:px-0">
      {session?.user && (
        <section className="flex w-full flex-col">
          <SectionHeading
            title="Your progress"
            description={
              progress?.completedProblems > 0
                ? `You've solved a total of ${progress?.completedProblems} out of the ${progress?.totalProblems} problems on reetcode so far. Keep going!`
                : `You've not solved any problems on reetcode yet. We're excited to see you start solving problems.`
            }
            // link={{ title: "Explore all problem sets", href: "/" }}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="w-full rounded-lg border border-slate-50/[0.06] bg-slate-800 p-4">
              <h3 className="text-base font-normal text-white">
                Completed problems
              </h3>
              <div className="mt-2 flex items-baseline text-2xl font-semibold text-indigo-400">
                {progress?.completedProblems?.toString()}
                <span className="ml-2 text-sm font-medium text-slate-400">
                  {`of ${progress?.totalProblems} problems`}
                </span>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{
                      width: `${Math.max(progress?.percentageCompleted, 3)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="flex w-full flex-col">
        <SectionHeading
          title="Recommended problem sets"
          description="Want to learn how to solve a specific type of problem? Pick a problem set and see a range of problems."
          link={{ title: "Explore all problem sets", href: "/problem-sets" }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendedProblemSets.map((problemSet) => (
            <ProblemSetCard
              key={problemSet?.slug}
              problemSet={problemSet as unknown as SelectedAllProblemSets[0]}
            />
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col">
        <ProblemFilters
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <div className="mt-6 rounded border border-slate-50/[0.06]">
          <ProblemList problemsQuery={{ ...problemsQuery, data: list }} />
        </div>
      </section>
    </div>
  );
}

export function defaultFiltersChanged(
  query: Record<"difficulty" | "careerPath", string>,
  currentFilters: ProblemFilterState,
) {
  return (
    JSON.stringify(getDefaultFilterStateFromQuery(query)) !==
    JSON.stringify(currentFilters)
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

    const [problems, progress] = await Promise.all([
      databaseService.getAllProblems(prepareFilterForQuery(problemsQuery)),
      databaseService.getAllProgressStats(ctx.req.session?.user?.id),
    ]);

    return {
      props: {
        session: ctx.req.session,
        problems,
        progress,
      },
    };
  },
);
