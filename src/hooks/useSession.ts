import dayjs from "dayjs";
import type { IronSessionData } from "iron-session";

interface UseSessionProps {
  session: IronSessionData | null | undefined;
}

export function useSession({ session }: UseSessionProps) {
  const isExpired = session?.user?.subscription
    ? dayjs().isAfter(dayjs(session?.user?.subscription?.expiresAt))
    : false;

  const expiresAt = dayjs(session?.user?.subscription?.expiresAt).format(
    "ddd D MMM, YYYY",
  );

  const isActive =
    session?.user?.subscription?.status === "ACTIVE" && !isExpired;

  const isCancelled = session?.user?.subscription?.status === "CANCELLED";

  const daysUntilExpiry = dayjs(session?.user?.subscription?.expiresAt).diff(
    dayjs(),
    "days",
  );

  const isExpiringSoon = isActive ? daysUntilExpiry <= 5 : false;

  const isLifetimeSubscription =
    isActive && session?.user?.subscription?.plan === "LIFETIME";

  return {
    session,
    subscription: {
      isActive,
      isExpired,
      expiresAt,
      isCancelled,
      isExpiringSoon,
      daysUntilExpiry,
      isLifetimeSubscription,
    },
  };
}
