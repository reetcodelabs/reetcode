import { BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";

import { Page } from "@/components/Page";
import { ProblemFilters } from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { withIronSessionSsr } from "@/utils/session";

import ProblemSetsData from "@/seed/problem-sets.json";
import { type ProblemSet } from "@prisma/client";
import { useRouter } from "next/router";

interface ProblemSetDetailsProps {
  problemSet: ProblemSet;
}

export default function ProblemSetDetails({
  problemSet,
}: ProblemSetDetailsProps) {
  const { query } = useRouter();

  return (
    <Page>
      <div className="flex items-start gap-x-4 lg:gap-x-8">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded border border-slate-50/[0.06] bg-slate-800 shadow lg:h-28 lg:w-28">
          <img
            src={problemSet?.icon}
            alt={problemSet?.name}
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

              <span>322 problems</span>
            </p>

            <p className="flex items-center">
              <ClockIcon className="mr-1 h-4 w-4 stroke-current text-blue-500" />

              <span>412 mins</span>
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

      <ProblemFilters />
      <div className="rounded border border-slate-50/[0.06]">
        <ProblemList />
      </div>
    </Page>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problemSet = ProblemSetsData.find(
      (problemSet) => problemSet?.slug === ctx.query["slug"],
    );

    if (!problemSet) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        session: ctx.req.session,
        problemSet,
      },
    };
  },
);
