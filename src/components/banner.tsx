import classNames from "classnames";
import Link from "next/link";
import { type PropsWithChildren } from "react";

interface BannerProps {
  variant?: "info" | "danger" | "warning";
  title?: string;
  href?: string;
  content?: string;
}

export function Banner({
  variant = "info",
  title,
  href,
  content,
}: PropsWithChildren<BannerProps>) {
  return (
    <div
      className={classNames(
        "relative z-[160] flex items-center gap-x-6 px-6 py-2.5 sm:px-3.5 sm:before:flex-1",
        {
          "bg-indigo-600": variant === "info",
          "bg-purple-500": variant === "warning",
          "bg-red-500": variant === "danger",
        },
      )}
    >
      <p className=" leading-6 text-white">
        {href ? (
          <Link href={href}>
            <strong className="">{title}</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            {content}&nbsp;
            <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </p>
      <div className="flex flex-1 justify-end"></div>
    </div>
  );
}
