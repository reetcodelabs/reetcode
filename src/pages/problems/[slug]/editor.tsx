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
import MenuScale from '@/iconoir/menu-scale.svg'
import ArrowLeft from "@/iconoir/arrow-left.svg";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProblemProps {
  problem: ProblemWithTemplate;
}

const Panels = dynamic(() => import('@/components/editor/Panels'))

export default function ProblemEditor({ problem }: ProblemProps) {
  const [openContextMenu, setOpenContextMenu] = useState(false)

  return (
    <SandpackProvider
      template="react-ts"
      theme={defaultThemes.cobalt2}
      className="flex h-[calc(100vh-57px)]"
    >
      <div
        className={cn("h-full border-r border-slate-50/[0.06] bg-slate-900", {
          "w-[320px]": openContextMenu,
          "w-12": !openContextMenu,
        })}
      >
        <header className="flex w-full justify-end border-b border-slate-50/[0.06]">
          <button
            onClick={() => setOpenContextMenu((current) => !current)}
            className="flex h-12 w-12 items-center justify-center self-end border-l border-slate-50/[0.06] text-white transition ease-linear hover:bg-slate-50/[0.06]"
          >
            {openContextMenu ? <ArrowLeft /> : <MenuScale />}
          </button>
        </header>
      </div>
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
