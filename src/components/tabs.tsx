import classNames from "classnames";
import type { ReactNode } from "react";
import { useState } from "react";

interface Tab {
  name: string;
  value: string;
  current?: boolean;
  content: ReactNode;
}

export function Tabs({ tabs = [] }: { tabs?: Tab[] }) {
  const [currentIndex, setCurrentIndex] = useState<number>(
    () => tabs?.findIndex((tab) => tab?.current) || 0,
  );

  const currentTab = tabs[currentIndex];

  return (
    <>
      <div className="sticky top-0 z-10 rounded-t-md bg-slate-900">
        <div className=" mx-auto max-w-7xl">
          <div className="h-12 sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
              defaultValue={currentTab?.name}
              onChange={(event) => {
                setCurrentIndex(parseInt(event.target.value));
              }}
            >
              {tabs.map((tab, idx) => (
                <option key={tab.name} value={idx}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden h-12 sm:block">
            <nav className="flex h-full items-center border-b border-slate-50/[0.06]">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-3 text-sm font-semibold leading-6 text-gray-400"
              >
                {tabs.map((tab, idx) => (
                  <li key={tab.name}>
                    <button
                      onClick={() => setCurrentIndex(idx)}
                      className={classNames(
                        "focused-link font-sans transition ease-linear hover:text-white",
                        {
                          "text-indigo-500": idx === currentIndex,
                        },
                      )}
                    >
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {tabs.map((tab, idx) => (
          <div
            key={tab.value}
            className={classNames(
              "absolute w-full opacity-0 transition ease-linear",
              {
                "opacity-100": currentIndex === idx,
              },
            )}
            style={{ zIndex: idx + 1 }}
          >
            {tab?.content}
          </div>
        ))}
      </div>
    </>
  );
}
