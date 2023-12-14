import { PrismaAdapter } from "@auth/prisma-adapter";
import { GetServerSidePropsContext } from "next";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";

import { SendVerificationRequestParams } from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    {
      id: "mailcoach",
      type: "email",
      async sendVerificationRequest({
        identifier: email,
        url,
      }: SendVerificationRequestParams) {
        // TODO: Send transactional email via mailcoach
        console.log({ email, url });
      },
    } as any,
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // TwitterProvider({
    //   clientId: "",
    //   clientSecret: "",
    // }),
    // ...add more providers here
  ],
} satisfies NextAuthOptions;

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
