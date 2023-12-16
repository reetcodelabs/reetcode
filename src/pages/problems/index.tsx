import Link from "next/link";

import { ProblemFilters } from "@/components/ProblemFilters";
import { ProblemList } from "@/components/problems/ProblemList";
import { SectionHeading } from "@/components/SectionHeading";
import { withIronSessionSsr } from "@/utils/session";

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
          {[1, 2, 3, 4].map((x) => (
            <Link
              key={x}
              href="/"
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
                      <stop
                        className="stop2"
                        offset="100%"
                        stopColor="#3d12ff"
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    id="backgr"
                    width={256}
                    height={256}
                    fill="none"
                    rx={60}
                  />
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
                  <span className="rounded-xl">Security</span>
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Solve real world problems around web application security
                </p>
              </div>
            </Link>
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
