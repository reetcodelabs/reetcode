import { BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PropsWithChildren } from "react";

import { type ProblemSet } from "@prisma/client";

export interface ProblemSetCardProps extends Omit<ProblemSet, "id"> {
  expanded?: boolean;
}

export function ProblemSetCard({
  name,
  slug,
  icon,
  expanded,
  shortDescription,
}: PropsWithChildren<ProblemSetCardProps>) {
  return (
    <Link
      href={`/problem-sets/${slug}`}
      className="group relative cursor-pointer rounded-xl border border-slate-800 focus-within:outline-none "
    >
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 transition duration-200 ease-linear [--quick-links-hover-bg:theme(colors.slate.800)] [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-focus-within:opacity-100 group-hover:opacity-100"></div>
      <div className="relative overflow-hidden rounded-xl p-6">
        <img className="h-12 w-12" src={icon} alt={name} />

        <h2 className="font-display my-4 text-base text-white">
          <span className="rounded-xl">{name}</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">{shortDescription}</p>

        {expanded ? (
          <div className="mt-6 flex w-full items-center gap-x-4">
            <p className="flex items-center text-xs leading-5 text-gray-400">
              <BeakerIcon className="mr-1 h-4 w-4 fill-current text-indigo-500" />

              <span>322 problems</span>
            </p>

            <p className="flex items-center text-xs leading-5 text-gray-400">
              <ClockIcon className="mr-1 h-4 w-4 stroke-current text-blue-500" />

              <span>412 mins</span>
            </p>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
