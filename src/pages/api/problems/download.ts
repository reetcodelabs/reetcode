import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import { invalidPayloadResponse } from "@/server/response";

const DownloadProblemSchema = z.object({
  templateId: z.string(),
  problemId: z.string().optional(),
});

export default async function downloadProblem(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = await DownloadProblemSchema.safeParseAsync(request.query);

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  const problem = await prisma.problem.findFirst({
    where: {
      OR: [
        {
          slug: validation.data.problemId,
        },
        {
          id: validation.data.problemId,
        },
      ],
    },
    include: {
      templates: {
        where: {
          OR: [
            {
              name: validation.data.templateId,
            },
            {
              id: validation.data.templateId,
            },
          ],
        },
        include: {
          starterFiles: true,
        },
      },
    },
  });

  return response.json(problem);
}
