import {
  type SandpackFile,
  type SandpackPredefinedTemplate,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import * as defaultThemes from "@codesandbox/sandpack-themes";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import ArrowLeft from "@/iconoir/arrow-left.svg";
import MenuScale from "@/iconoir/menu-scale.svg";
import { cn } from "@/lib/utils";
import {
  databaseService,
  type ProblemWithTemplate,
} from "@/server/services/database";
import { withIronSessionSsr } from "@/utils/session";

interface ProblemProps {
  problem: ProblemWithTemplate;
}

const ACTIVATE_CONTEXT_MENU = false;

const Panels = dynamic(() => import("@/components/editor/Panels"));

export default function ProblemEditor({ problem }: ProblemProps) {
  const [openContextMenu, setOpenContextMenu] = useState<boolean>(false);

  const template = useMemo(() => {
    return (problem?.template ??
      problem.problemTemplates?.find((template) => template.default === true))!;
  }, []);

  const files = useMemo(() => {
    const files: Record<string, SandpackFile> = {};

    if (problem?.solution?.files && problem?.solution?.files?.length > 0) {
      problem.solution.files.forEach((file) => {
        files[file.path] = {
          code: file.content,
          hidden: false,
          readOnly: false,
        };
      });
    } else {
      template?.starterFiles?.forEach((file) => {
        const isTestFile =
          file.path.includes("spec") || file.path.includes("test");

        if (!isTestFile) {
          files[file.path] = {
            code: file.content,
            hidden: false,
            readOnly: !(template?.editableFiles as string[])?.includes(
              file.path,
            ),
          };
        }
      });
    }

    return files;
  }, [template]);

  console.log({ files });

  return (
    <SandpackProvider
      files={files}
      theme={defaultThemes.monokaiPro}
      className="flex h-[calc(100vh-57px)]"
      template={template?.sandpackTemplate as SandpackPredefinedTemplate}
    >
      {ACTIVATE_CONTEXT_MENU && (
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
      )}

      <Panels problem={problem} template={template} />
    </SandpackProvider>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(ctx) {
    const problem = await databaseService.getProblemBySlug(
      ctx.query.slug as string,
      ctx.query.template as string,
      ctx.req.session?.user?.id,
    );

    return {
      props: {
        session: ctx.req.session,
        problem,
      },
    };
  },
);
