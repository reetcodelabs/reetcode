import { z } from "zod";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/server/db";

import { withIronSessionApiRoute } from "@/utils/session";

export const ConfirmMagicLinkValidationSchema = z.object({
  token: z.string(),
  callbackURL: z.string().optional(),
});

export async function confirmMagicLink(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = ConfirmMagicLinkValidationSchema.safeParse(request.query);

  if (!validation.success) {
    return response.redirect(
      301,
      `${
        (request.query?.callbackURL as string) ?? "/"
      }?errorMessage=Your magic link was invalid. Please try to login again.`,
    );
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      token: validation.data.token,
    },
  });

  if (!verificationToken) {
    return response.redirect(
      301,
      `${
        validation.data.callbackURL ?? "/"
      }?errorMessage=Your magic link was invalid. Please try to login again.s`,
    );
  }

  const expiredToken = dayjs().isAfter(dayjs(verificationToken.expires));

  if (expiredToken) {
    return response.redirect(
      301,
      `${
        validation.data.callbackURL ?? "/"
      }?errorMessage=Your magic link has expired. Please try to login again.`,
    );
  }

  // create user in database
  const user = await db.user.upsert({
    where: {
      email: verificationToken.email,
    },
    create: {
      email: verificationToken.email,
      emailVerified: dayjs().toDate(),
    },
    update: {
      emailVerified: dayjs().toDate(),
    },
    select: {
      id: true,
      email: true,
      subscription: true,
    },
  });

  // create iron session for user.
  request.session.user = {
    id: user.id,
    email: user.email,
    subscription: user?.subscription,
  };

  await request.session.save();

  return response.redirect(
    301,
    `${
      validation.data.callbackURL ?? ""
    }?successMessage=Successfully logged in.`,
  );
}

export default withIronSessionApiRoute(confirmMagicLink);
