import classNames from "classnames";
import type { PropsWithChildren } from "react";

export interface BadgeProps {
  variant?:
    | "dark"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink";
}

export function Badge({ children, variant }: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        {
          "bg-gray-400/10 text-gray-400 ring-gray-400/20": variant === "dark",
          "bg-red-400/10 text-red-400 ring-red-400/20": variant === "red",
          "bg-green-500/10 text-green-400 ring-green-500/20":
            variant === "green",
          "bg-purple-400/10 text-purple-400 ring-purple-400/30":
            variant === "purple",
          "bg-pink-400/10 text-pink-400 ring-pink-400/20": variant === "pink",
        },
      )}
    >
      {children}
    </span>
  );
  return (
    <>
      <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 ">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
        Badge
      </span>
      <span className="inline-flex items-center rounded-md bg-pink-400/10 px-2 py-1 text-xs font-medium text-pink-400 ring-1 ring-inset ring-pink-400/20">
        Badge
      </span>
    </>
  );
}
