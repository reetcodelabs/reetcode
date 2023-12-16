import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { Badge } from "../badge";

const people = [
  {
    name: "Udemy course page: apply discount code",
    email:
      "Implement the discount functionality on the udemy course purchase page.",
    role: "Co-Founder / CEO",
    difficulty: "easy",
    imageUrl: "https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Youtube: video upload",
    email: "Fix a bug on the Youtube video upload widget.",
    role: "Co-Founder / CTO",
    difficulty: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    difficulty: "easy",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    difficulty: "hard",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    difficulty: "hard",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    difficulty: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

export function ProblemList() {
  return (
    <ul role="list" className="divide-y divide-gray-800">
      {people.map((person) => (
        <li
          key={person.email}
          className="flex w-full cursor-pointer transition ease-linear focus-within:bg-slate-800 hover:bg-slate-800"
        >
          <Link
            className="focused-link flex w-full flex-col justify-between gap-x-6 px-4 py-5 lg:flex-row "
            href="/problems/udemy-discount-button"
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center text-sm font-semibold leading-6 text-white">
                  <p>{person.name}</p>
                  <p className="ml-2 flex items-center gap-x-1">
                    {[1, 2, 3, 4].map((x) => (
                      <img
                        key={x}
                        alt={person.name}
                        src={person.imageUrl}
                        className="h-4 w-4 flex-none rounded-full bg-gray-800"
                      />
                    ))}
                  </p>
                </div>
                <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                  {person.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center lg:mt-0">
              <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="flex items-center gap-x-2 text-sm leading-6 text-white">
                  {person?.difficulty === "easy" ? (
                    <Badge variant="green">Easy</Badge>
                  ) : null}
                  {person?.difficulty === "medium" ? (
                    <Badge variant="purple">Medium</Badge>
                  ) : null}
                  {person?.difficulty === "hard" ? (
                    <Badge variant="red">Hard</Badge>
                  ) : null}

                  <Badge variant="pink">
                    <AcademicCapIcon className="mr-2 h-4 w-4" />
                    Backend eng.
                  </Badge>
                  <Badge variant="pink">
                    <AcademicCapIcon className="mr-2 h-4 w-4" />
                    Frontend eng.
                  </Badge>
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
                    <time dateTime={person.lastSeenDateTime}>35 mins</time>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
