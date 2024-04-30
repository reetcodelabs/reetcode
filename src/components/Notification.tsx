import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { type PropsWithChildren } from "react";

interface AlertProps {
  className?: string;
  variant?: "success" | "error" | "info";
  title?: string;
  description?: string;
  asToast?: boolean;
}

export function Alert({
  className,
  variant,
  title,
  description,
  asToast = true,
  children,
}: PropsWithChildren<AlertProps>) {
  return (
    <div
      className={classNames(
        "rounded-md p-4 transition ease-linear",
        {
          "bg-red-600": variant === "error",
          "bg-green-600": variant === "success",
          "border border-blue-700 bg-transparent text-white hover:bg-blue-800":
            variant === "info",
          "min-w-[32rem]": asToast,
        },
        className,
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {variant === "error" ? (
            <XCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
          ) : null}

          {variant === "success" ? (
            <CheckCircleIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          ) : null}

          {variant === "info" ? (
            <InformationCircleIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div className="ml-3">
          <h3 className={classNames("text-sm font-medium text-white")}>
            {title}
          </h3>
          <div className="mt-2 text-xs text-white">
            {description ? <p>{description}</p> : children}
          </div>
        </div>
      </div>
    </div>
  );
}
