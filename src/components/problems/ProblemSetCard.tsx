import { BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export interface ProblemSetCardProps {
  name?: string;
  description?: string;
  expanded?: boolean;
}

export function ProblemSetCard({
  name,
  expanded,
  description,
}: PropsWithChildren<ProblemSetCardProps>) {
  return (
    <Link
      href="/problem-sets/security"
      className="group relative cursor-pointer rounded-xl border border-slate-800 focus-within:outline-none "
    >
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 transition duration-200 ease-linear [--quick-links-hover-bg:theme(colors.slate.800)] [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-focus-within:opacity-100 group-hover:opacity-100"></div>
      <div className="relative overflow-hidden rounded-xl p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={48}
          height={48}
          viewBox="0 0 256 256"
          fill="none"
          id="my-svg"
        >
          <defs>
            <linearGradient id="gradient1">
              <stop className="stop1" offset="0%" stopColor="#8f66ff" />
              <stop className="stop2" offset="100%" stopColor="#3d12ff" />
            </linearGradient>
          </defs>
          <rect id="backgr" width={256} height={256} fill="none" rx={60} />
          <g id="group" transform="translate(0,0) scale(1)">
            <path
              d="M140.666 107.294H154.667C165.113 107.294 174.557 111.620 181.333 118.594M94.001 107.294H80.000C59.381 107.294 42.667 124.149 42.667 144.941V173.177C42.667 183.572 51.024 192.000 61.333 192.000H128.000M154.667 76.582C154.667 101.204 133.926 116.706 117.333 116.706C100.741 116.706 80.000 101.204 80.000 76.582C80.000 51.960 94.424 32.000 117.333 32.000C140.243 32.000 154.667 51.960 154.667 76.582Z"
              stroke="#818cf8"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              id="primary"
            />
            <path
              d="M160.000 160.000C160.000 160.000 178.828 149.333 192.000 149.333C205.172 149.333 224.000 160.000 224.000 160.000V202.667L192.000 224.000L160.000 202.667V160.000Z"
              stroke="#22d3ee"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              id="secondary"
            />
          </g>
        </svg>

        {/* <UserIcon className="w-h h-8 fill-current text-white" /> */}

        <h2 className="font-display my-4 text-base text-white">
          <span className="rounded-xl">{name}</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>

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
