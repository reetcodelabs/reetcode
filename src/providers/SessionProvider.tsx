import { type IronSessionData } from "iron-session";
import { createContext, type PropsWithChildren,useContext } from "react";

interface SessionProps {
  session?: IronSessionData | null | undefined;
}

export const SessionCtx = createContext<SessionProps>({});

export function SessionProvider({
  session,
  children,
}: PropsWithChildren<SessionProps>) {
  return (
    <SessionCtx.Provider value={{ session }}>{children}</SessionCtx.Provider>
  );
}

export function useClientIronSession() {
 return useContext(SessionCtx)
}
