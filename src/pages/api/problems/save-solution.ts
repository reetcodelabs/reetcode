import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import {
  invalidPayloadResponse,
  unauthenticatedResponse,
} from "@/server/response";
import { withIronSessionApiRoute } from "@/utils/session";

const ExecuteTestsSchema = z.object({
  problemId: z.string(),
  templateId: z.string(),
  files: z.array(
    z.object({
      path: z.string(),
      code: z.string(),
    }),
  ),
});

export async function handleSaveSolution(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = request.session;

  if (!session?.user?.id) {
    return unauthenticatedResponse(response);
  }

  const validation = await ExecuteTestsSchema.safeParseAsync(
    request.body ?? {},
  );

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  let solution = await prisma.solution.findFirst({
    where: {
      problemId: validation.data.problemId,
      userId: session?.user?.id,
      templateId: validation.data.templateId,
    },
  });

  await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
  });

  if (!solution) {
    solution = await prisma.solution.create({
      data: {
        userId: session?.user?.id,
        templateId: validation.data.templateId,
        problemId: validation.data.problemId,
      },
    });
  }

  for (const file of validation.data.files) {
    await prisma.file.upsert({
      where: {
        solutionTemplateId_path: {
          path: file.path,
          solutionTemplateId: validation.data.templateId,
        },
      },
      create: {
        path: file.path,
        content: file.code,
      },
      update: {
        content: file.code,
      },
    });
  }

  const files = await Promise.all(
    validation.data.files.map((file) => {
      return prisma.file.upsert({
        where: {
          starterTemplateId_path: {
            path: file.path,
            starterTemplateId: validation.data.templateId,
          },
        },
        create: {
          path: file.path,
          content: file.code,
          solutionId: solution.id,
        },
        update: {
          content: file.code,
        },
      });
    }),
  );

  return response.json({ data: { ...solution, files } });
}

export default withIronSessionApiRoute(handleSaveSolution);
