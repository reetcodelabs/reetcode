import type { PropsWithChildren } from "react";

export function RenderIf({
  if: condition,
  children,
}: PropsWithChildren<{ if?: boolean }>) {
  if (!condition) {
    return null;
  }

  return <>{children}</>;
}
