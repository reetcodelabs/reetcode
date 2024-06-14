import { Page } from "@/components/Page";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import { SectionHeading } from "@/components/SectionHeading";
import {
  databaseService,
  type SelectedAllProblemSets,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";

interface ProblemSetsProps {
  problemSets: SelectedAllProblemSets;
}

export default function ProblemSets({ problemSets }: ProblemSetsProps) {
  return (
    <Page>
      <section className="flex w-full flex-col">
        <SectionHeading
          title="Problem sets"
          description="Want to learn how to solve a specific type of problem? Pick a problem set and see a range of problems."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problemSets.map((problemSet) => (
            <ProblemSetCard
              key={problemSet?.slug}
              expanded
              problemSet={problemSet}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const allProblemSets = await databaseService.getAllProblemSets();

    return {
      props: {
        session: ctx.req.session,
        problemSets: allProblemSets,
      },
    };
  },
);
