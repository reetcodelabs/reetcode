import { type Subscription } from "@prisma/client";
import { type IronSessionOptions } from "iron-session";
import {
  withIronSessionApiRoute as baseWithIronSessionApiRoute,
  withIronSessionSsr as baseWithIronSessionSsr,
} from "iron-session/next";
import { type GetServerSideProps, type NextApiHandler } from "next";

import { env } from "@/env";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: string;
      email: string;
      subscription?: Subscription | null;
    };
  }
}

export const ironSessionOptions = {
  password: env.IRON_SESSION_PASSWORD,
  cookieName: "AUTH_SESSION",
  ttl: 24 * 60 * 60,
} satisfies IronSessionOptions;

export function getSessionOptions(): IronSessionOptions {
  return {
    password: env.IRON_SESSION_PASSWORD,
    cookieName: "AUTH_SESSION",
    ttl: 24 * 60 * 60,
  };
}

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function withIronSessionApiRoute(routeHandler: NextApiHandler) {
  return baseWithIronSessionApiRoute(routeHandler, getSessionOptions());
}

export function withIronSessionSsr<
  P extends {
    [key: string]: unknown;
  } = {
    [key: string]: unknown;
  },
>(getServerSideProps: GetServerSideProps<P>) {
  return baseWithIronSessionSsr(getServerSideProps, getSessionOptions());
}
