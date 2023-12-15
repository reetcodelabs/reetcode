import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface AlertProps {
  className?: string;
  variant?: "success" | "error";
  title?: string;
  description?: string;
}

export function Alert({ className, variant, title, description }: AlertProps) {
  return (
    <div
      className={classNames(
        "rounded-md p-4 transition ease-linear",
        {
          "bg-red-600": variant === "error",
          "bg-green-600": variant === "success",
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
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <div className="mt-2 text-xs text-white">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
