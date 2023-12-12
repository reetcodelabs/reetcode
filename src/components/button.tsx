import classNames from "classnames";
import { PropsWithChildren, ComponentPropsWithoutRef } from "react";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  className,
  variant = "primary",
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type="button"
      className={classNames(
        "rounded-sm  px-2.5 py-1.5 text-sm font-semibold  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 ",
        {
          "bg-indigo-500 text-white  hover:bg-indigo-400 focus-visible:outline-indigo-500":
            variant === "primary",
          " border border-slate-50/[0.06] text-white hover:bg-slate-800":
            variant === "secondary",
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
