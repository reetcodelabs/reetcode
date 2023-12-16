import { PrismaAdapter } from "@auth/prisma-adapter";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from "next";
import {
  type NextAuthOptions,
  type Session,
  getServerSession,
} from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type {
  EmailConfig,
  SendVerificationRequestParams,
} from "next-auth/providers/email";

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
    } as unknown as EmailConfig,
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, token, user }) {
      return session;
    },
    jwt({ account, profile, token }) {
      return token;
    },
  },
} satisfies NextAuthOptions;

export function getServerAuthSession(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return getServerSession(ctx.req, ctx.res, authOptions);
}

export type GetServerSidePropsWithSession<
  Props = Record<string, string | Session | null>,
> = GetServerSideProps<{ session: Session | null } & Props>;

export async function getServerSidePropsWithAuth<
  Props extends Record<string, string | Session | null>,
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

export function unauthenticatedResponse(response: NextApiResponse) {
  return response.status(401).json({
    message: "Unauthenticated.",
  });
}

export function invalidPayloadResponse(
  response: NextApiResponse,
  errors?: Record<string, string>,
) {
  return response.status(422).json({
    message: "Invalid data provided.",
    ...errors,
  });
}

export async function getAuthSession(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = await getServerSession(request, response, authOptions);

  return session;
}
