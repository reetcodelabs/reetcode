import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/server/prisma";

export default async function handleTryRandomChallenge(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const totalProblems = await prisma.problem.count({
    where: { premiumOnly: false },
  });

  const skip = Math.floor(Math.random() * totalProblems);

  const randomProblem = await prisma.problem.findMany({
    skip,
    take: 1,
    where: {
      premiumOnly: false,
    },
    select: {
      slug: true,
    },
  });

  return response.redirect(`/problems/${randomProblem?.[0]?.slug}`);
}
