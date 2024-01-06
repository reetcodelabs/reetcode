import type { SubscriptionPlan } from "@prisma/client";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import {
  invalidPayloadResponse,
  unauthenticatedResponse,
} from "@/server/response";
import { verifyTransactionReference } from "@/utils/paystack";
import { withIronSessionApiRoute } from "@/utils/session";

export const CreateSubscriptionValidationSchema = z.object({
  reference: z.string(),
  plan: z.enum(["annually", "monthly", "lifetime"]),
});

const planPrices = {
  monthly: 4990,
  annually: 29990,
  lifetime: 39990,
};

export async function createSubscription(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = request.session;

  if (!session?.user?.id) {
    return unauthenticatedResponse(response);
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    select: {
      id: true,
      email: true,
      subscription: true,
    },
  });

  if (!user) {
    return invalidPayloadResponse(response, {
      user: "There seems to be something wrong with your session.",
    });
  }

  const validation = await CreateSubscriptionValidationSchema.safeParseAsync(
    request.body,
  );

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  // to subscribe, verify the paystack reference
  const {
    status,
    amount = 0,
    authorization,
    channel,
  } = await verifyTransactionReference(validation.data.reference);

  if (!status) {
    return invalidPayloadResponse(response, {
      reference: "Invalid payment reference.",
    });
  }

  if (amount < planPrices[validation.data.plan]) {
    return invalidPayloadResponse(response, {
      amount:
        "It seems there was an error with the total amount you paid. Please contact our support to resolve this.",
    });
  }

  let expiresAt: Date;

  switch (validation.data.plan) {
    case "monthly":
      expiresAt = dayjs(user?.subscription?.expiresAt)
        .add(1, "month")
        .toDate();

      break;
    case "annually":
      expiresAt = dayjs(user?.subscription?.expiresAt)
        .add(1, "year")
        .toDate();
      break;
    case "lifetime":
      expiresAt = dayjs().add(100, "year").toDate();
      break;
  }

  const commonSubscriptionData = {
    channel,
    expiresAt,
    bank: authorization?.bank,
    authorizationCode: authorization?.authorization_code,
    last4: authorization?.last4,
    expMonth: authorization?.exp_month,
    expYear: authorization?.exp_year,
    brand: authorization?.brand,
    cardType: authorization?.card_type,
  };

  // create a subscription for customer
  const subscription = await prisma.subscription.upsert({
    create: {
      userId: user.id,
      subscribedAt: new Date(),
      plan: validation.data.plan.toUpperCase() as SubscriptionPlan,
      status: "ACTIVE",
      ...commonSubscriptionData,
    },
    update: {
      subscribedAt: new Date(),
      plan: validation.data.plan.toUpperCase() as SubscriptionPlan,
      status: "ACTIVE",
      ...commonSubscriptionData,
    },
    where: {
      userId: user.id,
    },
  });

  // update session with user subscription status

  request.session.user = {
    ...session?.user,
    subscription,
  };

  await request.session.save();

  return response.json({
    message: `Successfully subscribed to the ${validation.data.plan} plan.`,
  });
}

export default withIronSessionApiRoute(createSubscription);
