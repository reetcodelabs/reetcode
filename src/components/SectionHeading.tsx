import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface SectionHeadingProps {
  title?: string;
  description?: string;
  link?: {
    title: string;
    href: string;
  };
}

export function SectionHeading({
  title,
  description,
  link,
}: PropsWithChildren<SectionHeadingProps>) {
  return (
    <div className="mb-6 flex w-full flex-col items-start md:flex-row md:justify-between lg:mb-0">
      <div className="mb-6 lg:mb-12">
        <h2 className="text-3xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>

      {link ? (
        <Link
          href={link?.href}
          className="focused-link flex items-center text-sm text-slate-400 transition ease-linear hover:text-white focus:text-white"
        >
          {link?.title}
          <ArrowRightIcon className="ml-2 h-4 w-4 fill-current" />
        </Link>
      ) : null}
    </div>
  );
}
