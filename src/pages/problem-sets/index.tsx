import { Page } from "@/components/Page";
import { SectionHeading } from "@/components/SectionHeading";
import { ProblemSetCard } from "@/components/problems/ProblemSetCard";
import {
  GetServerSidePropsWithSession,
  getServerSidePropsWithAuth,
} from "@/server/auth";

export default function ProblemSets() {
  return (
    <Page>
      <section className="flex w-full flex-col">
        <SectionHeading
          title="Problem sets"
          description="Want to learn how to solve a specific type of problem? Pick a problem set and see a range of problems."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
            <ProblemSetCard
              key={x}
              expanded
              name={"Security"}
              description="Solve real world problems around web application security"
            />
          ))}
        </div>
      </section>
    </Page>
  );
}

export const getServerSideProps: GetServerSidePropsWithSession = (ctx) =>
  getServerSidePropsWithAuth(ctx, (ctx, session) => {
    return {
      props: {
        session,
      },
    };
  });
