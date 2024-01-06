import Crypto from "crypto";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { env } from "@/env";
import prisma from "@/server/prisma";
import { invalidPayloadResponse } from "@/server/response";
import { MailcoachEmails, sendTransactionalEmail } from "@/utils/mailcoach";

export const SendMagicLinkValidationSchema = z.object({
  email: z.string().email(),
  callbackURL: z.string().optional(),
});

export default async function sendMagicLink(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = SendMagicLinkValidationSchema.safeParse(request.body);

  if (!validation.success) {
    return invalidPayloadResponse(response, {
      message: "Please provide a valid email address.",
    });
  }

  // create user in database
  const user = await prisma.user.upsert({
    where: {
      email: validation.data.email,
    },
    create: {
      email: validation.data.email,
      apiKey: Crypto.randomUUID(),
    },
    update: {},
  });

  const token = Crypto.randomBytes(32).toString("hex");

  const expires = dayjs().add(1, "hour").toDate();

  await prisma.verificationToken.upsert({
    where: {
      email: validation.data.email,
    },
    create: {
      email: validation.data.email,
      token,
      expires,
    },
    update: {
      token,
      expires,
    },
  });

  const magicLink = new URL(`${env.APP_URL}/api/accounts/confirm-magic-link`);

  magicLink.searchParams.append("token", token);

  if (validation.data.callbackURL) {
    magicLink.searchParams.append("callbackURL", validation.data.callbackURL);
  }

  await sendTransactionalEmail(
    MailcoachEmails.EMAIL_VERIFICATION_LINK,
    user.email,
    {
      emailVerificationLink: magicLink.href,
    },
  );

  return response.json({
    message:
      "Check your email. We send you a magic link. Click on it to login.",
  });
}
