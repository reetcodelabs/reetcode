import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const TAB_LIST_CLASSNAMES = (className?: string) =>
  twMerge(
    "flex items-center gap-x-6 h-16 border-b border-slate-50/[0.06] px-3 text-sm font-semibold leading-6 text-gray-400 overflow-x-auto",
    className,
  );

export const TAB_BUTTON_CLASSNAMES = (selected: boolean, className?: string) =>
  twMerge(
    classNames(
      "focus-within:outline-none focus-within:outline-offset-8 focus-within:outline-indigo-500 h-full px-6 font-sans transition ease-linear hover:text-white flex-shrink-0",
      {
        "border-b-2 border-indigo-500 font-semibold text-indigo-500": selected,
      },
      className,
    ),
  );

export function TabList({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <Tab.List
      className={twMerge(
        "flex h-full items-center gap-x-6 border-b border-slate-50/[0.06] px-3 text-sm font-semibold leading-6 text-gray-400",
        className,
      )}
    >
      {children}
    </Tab.List>
  );
}

export function TabButton({
  selected,
  children,
}: PropsWithChildren<{ className?: string; selected?: boolean }>) {
  return (
    <button
      className={twMerge(
        classNames(
          "focused-link h-full px-6 font-sans transition ease-linear hover:text-white",
          {
            "border-b-2 border-indigo-500 font-semibold text-indigo-500":
              selected,
          },
        ),
      )}
    >
      {children}
    </button>
  );
}
