import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "./button";

export function Page({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const router = useRouter();

  return (
    <div
      className={twMerge(
        "mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pb-48 pt-12 xl:px-0",
        className,
      )}
    >
      <div className="-mb-8 flex">
        <Button
          variant="secondary"
          className="flex items-center gap-x-3"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Button>
      </div>
      {children}
    </div>
  );
}
