import { Page } from "@/components/Page";
import { ProblemFilters } from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";

export interface ProblemSetDetailsProps {}

export default function ProblemSetDetails({}: PropsWithChildren<ProblemSetDetailsProps>) {
  return (
    <Page>
      <div className="flex items-start gap-x-4 lg:gap-x-8">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded border border-slate-50/[0.06] bg-slate-800 shadow lg:h-28 lg:w-28">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={48}
            height={48}
            viewBox="0 0 256 256"
            fill="none"
            id="my-svg"
            className="h-12 w-12 lg:h-24 lg:w-24"
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
        </div>

        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white lg:text-3xl">
            Application Security
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
            ea optio aliquam ver.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-slate-50/[0.06] bg-slate-800 p-4 text-sm text-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius maiores
        dicta, nostrum consectetur commodi quaerat repellendus accusantium
        ducimus. Natus repudiandae, iste unde eius doloribus odit totam! Odit
        fugiat suscipit numquam?
      </div>

      <ProblemFilters />
      <div className="rounded border border-slate-50/[0.06]">
        <ProblemList />
      </div>
    </Page>
  );
}
