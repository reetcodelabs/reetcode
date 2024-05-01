import {
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import * as defaultThemes from "@codesandbox/sandpack-themes";

import {
  databaseService,
  type ProblemWithTemplate,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";
import dynamic from "next/dynamic";

interface ProblemProps {
  problem: ProblemWithTemplate;
}

const Panels = dynamic(() => import('@/components/editor/Panels'))

export default function ProblemEditor({ problem }: ProblemProps) {
  return (
    <SandpackProvider
      template="react-ts"
      theme={defaultThemes.cobalt2}
      className="h-[calc(100vh-60px)]"
    >
      <Panels problem={problem} />
    </SandpackProvider>
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
