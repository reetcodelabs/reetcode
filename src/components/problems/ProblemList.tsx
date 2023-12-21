import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Difficulty, type Problem } from "@prisma/client";
import Link from "next/link";

import { technologiesLogos } from "@/utils/technologies";

import { Badge } from "../badge";

interface ProblemProps {
  problem: Problem & { careerPath?: { slug?: string } | null };
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  switch (difficulty) {
    case Difficulty.EASY:
      return <Badge variant="green">Easy</Badge>;
    case Difficulty.MEDIUM:
      return <Badge variant="purple">Medium</Badge>;
    case Difficulty.HARD:
      return <Badge variant="red">Hard</Badge>;
    default:
      return null;
  }
}

export function CareerPathBadge({ path }: { path?: string }) {
  switch (path) {
    case "frontend-engineering":
      return (
        <Badge variant="pink">
          <AcademicCapIcon className="mr-2 h-4 w-4" />
          Frontend eng.
        </Badge>
      );
    case "backend-engineering":
      return (
        <Badge variant="pink">
          <AcademicCapIcon className="mr-2 h-4 w-4" />
          Backend eng.
        </Badge>
      );
    default:
      return null;
  }
}

export function ProblemRow({ problem }: ProblemProps) {
  return (
    <Link
      className="focused-link flex w-full flex-col justify-between gap-x-6 px-4 py-5 lg:flex-row "
      href={`/problems/${problem.slug}`}
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <div className="flex items-center text-sm font-semibold leading-6 text-white">
            <p>{problem.name}</p>
            <div className="ml-2 flex items-center gap-x-1">
              {problem.techStack?.map((stack) => {
                const icon = technologiesLogos[stack];
                return (
                  <div
                    className="relative flex h-5 w-5 items-center justify-center rounded-full border border-slate-50/[0.06] bg-slate-800"
                    key={stack}
                  >
                    {icon}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-1 truncate text-xs leading-5 text-gray-400">
            {problem.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center lg:mt-0">
        <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className="flex items-center gap-x-2 text-sm leading-6 text-white">
            <DifficultyBadge difficulty={problem.difficulty} />
            <CareerPathBadge path={problem?.careerPath?.slug} />
          </p>
          <div className="mt-1 flex items-center text-xs leading-5 text-slate-400">
            <p className="flex items-center">
              <CheckCircleIcon className="mr-1 h-4 w-4" />
              <span>3,111 completed</span>
            </p>

            <svg viewBox="0 0 2 2" className="mx-2 h-1 w-1 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>

            <p className="flex items-center">
              <ClockIcon className="mr-1 h-4 w-4" />
              <time>{problem.completionDuration} mins</time>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ProblemListProps {
  problems: Problem[];
}

export function ProblemList({ problems }: ProblemListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-800">
      {problems.map((problem) => (
        <li
          key={problem.slug}
          className="flex w-full cursor-pointer transition ease-linear focus-within:bg-slate-800 hover:bg-slate-800"
        >
          <ProblemRow problem={problem} />
        </li>
      ))}
    </ul>
  );
}
