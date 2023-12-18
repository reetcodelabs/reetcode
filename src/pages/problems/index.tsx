import Link from "next/link";

import { ProblemFilters } from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { SectionHeading } from "@/components/SectionHeading";
import { withIronSessionSsr } from "@/utils/session";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";

import ProblemSets from "@/seed/problem-sets.json";

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

export default function Problems() {
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
        <ProblemFilters />

        <div className="mt-6 rounded border border-slate-50/[0.06]">
          <ProblemList />
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    return {
      props: {
        session: ctx.req.session,
      },
    };
  },
);
