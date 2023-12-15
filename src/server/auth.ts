import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { NextAuthOptions, Session, getServerSession } from "next-auth";

import { SendVerificationRequestParams } from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";
import { sendTransactionalEmail, MailcoachEmails } from "@/utils/mailcoach";

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 180 * 24 * 60 * 60, // six months
  },
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
        await sendTransactionalEmail(
          MailcoachEmails.EMAIL_VERIFICATION_LINK,
          email,
          {
            emailVerificationLink: url,
          },
        );

        console.log({ url, email });
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

export function getServerAuthSession(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return getServerSession(ctx.req, ctx.res, authOptions);
}

export type GetServerSidePropsWithSession<Props = Record<string, any>> =
  GetServerSideProps<{ session: Session | null } & Props>;

export async function getServerSidePropsWithAuth<
  Props extends Record<string, any>,
>(
  ctx: GetServerSidePropsContext,
  getServerSideProps: (
    ctx: GetServerSidePropsContext,
    session: Session | null,
  ) => GetServerSidePropsResult<Props>,
  mustBeAuthenticated?: boolean,
): Promise<GetServerSidePropsResult<Props>> {
  const session = await getServerAuthSession(ctx);

  if (!session && mustBeAuthenticated) {
    return {
      redirect: {
        destination: "/dashboard?signin=true",
        statusCode: 301,
      },
    };
  }

  return getServerSideProps(ctx, session);
}
