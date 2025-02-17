import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type Difficulty } from "@prisma/client";
import classNames from "classnames";
import { useRouter } from "next/router";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { RenderIf } from "./RenderIf";

const sortOptions = [
  { name: "Difficulty: Easy to Hard", value: "easy-to-hard", current: true },
  { name: "Difficulty: Hard to easy", value: "hard-to-easy", current: true },
];

interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}
interface Filter {
  id: string;
  name: string;
  activeCount: number;
  activeValue: string;
  options: FilterOption[];
}

const filters: Filter[] = [
  {
    id: "careerPath",
    name: "Career Paths",
    activeCount: 0,
    activeValue: "",
    options: [
      {
        value: "frontend-engineering",
        label: "Frontend Engineering",
        checked: false,
      },
      {
        value: "backend-engineering",
        label: "Backend Engineering",
        checked: true,
      },
    ],
  },
  {
    id: "difficulty",
    name: "Difficulty",
    activeCount: 0,
    activeValue: "",
    options: [
      { value: "EASY", label: "Easy", checked: false },
      { value: "MEDIUM", label: "Medium", checked: false },
      { value: "HARD", label: "Hard", checked: false },
    ],
  },
];

export interface ProblemFilterState {
  difficulty?: {
    in: Difficulty[];
  };
  careerPath: {
    slug: {
      in: string[];
    };
  };
}

export const QUERY_PARAMS_DELIMITER = "__";

export function ProblemFilters({
  activeFilters,
  setActiveFilters,
}: {
  activeFilters: ProblemFilterState;
  setActiveFilters: Dispatch<SetStateAction<ProblemFilterState>>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const listOfFilters: Filter[] = useMemo(() => {
    const activeFilterCounts: Record<string, number> = {
      difficulty: activeFilters?.difficulty?.in?.length ?? 0,
      careerPath: activeFilters?.careerPath?.slug?.in?.length ?? 0,
    };

    const activeFilterValues: Record<string, string> = {
      difficulty:
        activeFilters?.difficulty?.in
          ?.map((difficulty) => difficulty?.toLowerCase())
          ?.join(", ") ?? "",
      careerPath: activeFilters?.careerPath?.slug?.in?.join(", ") ?? "",
    };

    return filters.map((filter) => {
      return {
        ...filter,
        activeCount: activeFilterCounts[filter.id] ?? 0,
        activeValue: activeFilterValues[filter.id] ?? "",
      };
    });
  }, [activeFilters]);

  const listOfActiveFilters: Filter[] = useMemo(
    () => listOfFilters.filter((filter) => filter.activeCount > 0),
    [listOfFilters],
  );

  const getURLValueForActiveFilter = (filter: string) => {
    switch (filter) {
      case "difficulty":
        return (
          activeFilters?.difficulty?.in?.join(QUERY_PARAMS_DELIMITER) ??
          undefined
        );
      case "careerPath":
        return (
          activeFilters?.careerPath?.slug?.in?.join(QUERY_PARAMS_DELIMITER) ??
          undefined
        );
      default:
        return undefined;
    }
  };

  const onRemoveFilter = (filter: Filter) => {
    switch (filter.id) {
      case "difficulty":
        setActiveFilters((current) => ({ ...current, difficulty: { in: [] } }));
        return;
      case "careerPath":
        setActiveFilters((current) => ({
          ...current,
          careerPath: { slug: { in: [] } },
        }));
      default:
        break;
    }
  };

  // sync filter values to URL
  useEffect(() => {
    const filterNames = ["difficulty", "careerPath"];

    const params = new URLSearchParams(
      router.query?.slug ? { slug: router.query.slug as string } : {},
    );

    const filters: Record<"key" | "value", string>[] = [];

    for (const filter of filterNames) {
      const value = getURLValueForActiveFilter(filter);

      if (value) {
        filters.push({ key: filter, value });
      }
    }

    for (const filter of filters) {
      params.append(filter.key, filter.value);
    }

    void router.replace(
      { pathname: router.pathname, query: params.toString() },
      undefined,
      {
        shallow: true,
      },
    );
  }, [activeFilters]);

  const setDifficultyFilter = useCallback(
    (option: FilterOption, value: string) => {
      setActiveFilters((current) => {
        const difficultyValue = value as Difficulty;
        let difficulties: Difficulty[] = [...(current.difficulty?.in ?? [])];

        if (current.difficulty?.in?.includes(difficultyValue)) {
          difficulties = difficulties.filter(
            (difficulty) => difficulty !== difficultyValue,
          );
        } else {
          difficulties = [...difficulties, difficultyValue];
        }

        return {
          ...current,
          difficulty: {
            in: difficulties,
          },
        };
      });
    },
    [],
  );

  const setCareerPathFilter = useCallback(
    (option: FilterOption, careerPathValue: string) => {
      setActiveFilters((current) => {
        let careerPaths: string[] = [...(current.careerPath?.slug?.in || [])];

        if (careerPaths.includes(careerPathValue)) {
          careerPaths = careerPaths.filter((path) => path !== careerPathValue);
        } else {
          careerPaths = [...careerPaths, careerPathValue];
        }

        return {
          ...current,
          careerPath: {
            slug: {
              in: careerPaths,
            },
          },
        };
      });
    },
    [],
  );

  const onOptionChanged = (
    filter: Filter,
    option: FilterOption,
    value: string,
  ) => {
    switch (filter.id) {
      case "difficulty":
        setDifficultyFilter(option, value);
        return;
      case "careerPath":
        setCareerPathFilter(option, value);
        return;
      default:
        break;
    }
  };

  const getFilterOptionDefaultValue = (
    filter: Filter,
    option: FilterOption,
  ) => {
    switch (filter.id) {
      case "difficulty":
        return activeFilters.difficulty?.in?.includes(
          option.value as Difficulty,
        );
      case "careerPath":
        return activeFilters.careerPath?.slug?.in?.includes(option.value);
      default:
        break;
    }
  };

  return (
    <div className="rounded-lg border border-slate-50/[0.06]">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-slate-900 py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-white">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 p-2 text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {listOfFilters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="border-t border-slate-50/[0.06] px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-slate-900 px-2 py-3  text-slate-400">
                              <span className="font-medium text-slate-400">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? "-rotate-180" : "rotate-0",
                                    "h-5 w-5 transform",
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    onChange={(event) =>
                                      onOptionChanged(
                                        section,
                                        option,
                                        event.target.value,
                                      )
                                    }
                                    defaultChecked={getFilterOptionDefaultValue(
                                      section,
                                      option,
                                    )}
                                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3  text-slate-400"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Filters */}
      <section aria-labelledby="filter-heading" className="pt-4">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="pb-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="focused-link group inline-flex justify-center  font-medium text-slate-400 hover:text-white">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-white"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-64 origin-top-left rounded-md bg-slate-900 shadow-2xl ring-1 ring-slate-50/[0.06] ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <button
                            className={classNames(
                              option.current
                                ? "font-medium text-white"
                                : "text-slate-400",
                              active ? "bg-slate-800" : "",
                              "block w-full px-4 py-2 ",
                            )}
                          >
                            {option.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="inline-block  font-medium text-slate-400 hover:text-white sm:hidden"
              onClick={() => setOpen(true)}
            >
              Filters
            </button>

            <div className="hidden sm:block">
              <div className="flow-root">
                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                  {listOfFilters.map((section) => (
                    <Popover
                      key={section.name}
                      className="relative inline-block px-4 text-left"
                    >
                      <Popover.Button className="focused-link group inline-flex justify-center  font-medium text-slate-400 hover:text-white">
                        {({ open }) => (
                          <>
                            <span>{section.name}</span>
                            {section?.activeCount ? (
                              <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs  tabular-nums text-gray-700">
                                {section?.activeCount}
                              </span>
                            ) : null}
                            <ChevronDownIcon
                              className={classNames(
                                "-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-400 transition ease-linear group-hover:text-white",
                                {
                                  "rotate-180 transform": open,
                                },
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md border border-slate-50/[0.06] bg-slate-900 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <form className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  onChange={(event) =>
                                    onOptionChanged(
                                      section,
                                      option,
                                      event.target.value,
                                    )
                                  }
                                  defaultChecked={getFilterOptionDefaultValue(
                                    section,
                                    option,
                                  )}
                                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 whitespace-nowrap pr-6  font-medium text-white"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </form>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ))}
                </Popover.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Active filters */}
        <div className="rounded-b bg-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className=" font-medium text-slate-400">
              Filters
              <span className="sr-only">, active</span>
            </h3>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-white sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:ml-4 sm:mt-0">
              <RenderIf if={listOfActiveFilters.length === 0}>
                <p className="text-sm text-slate-400">
                  No filters applied yet.
                </p>
              </RenderIf>
              <RenderIf if={listOfActiveFilters.length > 0}>
                <div className="-m-1 flex flex-wrap items-center">
                  {listOfActiveFilters.map((filter) => (
                    <span
                      key={filter.id}
                      className="m-1 inline-flex items-center rounded-full border border-slate-50/[0.06] bg-slate-800 py-1.5 pl-3 pr-2  font-medium text-slate-400"
                    >
                      <span className="flex items-center">
                        <span>{filter.name}:</span>
                        <span className="ml-1 text-white">
                          {filter.activeValue}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="focused-link ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-gray-200 hover:text-slate-800"
                        onClick={() => onRemoveFilter(filter)}
                      >
                        <span className="sr-only">
                          Remove filter for {filter.name}
                        </span>
                        <svg
                          className="h-2 w-2"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 8 8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.5"
                            d="M1 1l6 6m0-6L1 7"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </RenderIf>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
