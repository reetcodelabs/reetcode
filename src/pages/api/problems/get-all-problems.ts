import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { invalidPayloadResponse } from "@/server/response";
import { databaseService } from "@/server/services/database";

const GetAllProblemsFilterSchema = z.object({
  difficulty: z
    .object({
      in: z.array(z.enum(["EASY", "MEDIUM", "HARD"])),
    })
    .optional(),
  careerPath: z
    .object({
      slug: z.object({
        in: z.array(z.string()),
      }),
    })
    .optional(),
  problemSets: z
    .object({
      some: z.object({
        slug: z.string(),
      }),
    })
    .optional(),
});

export default async function handleGetAllProblems(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = await GetAllProblemsFilterSchema.safeParseAsync(
    request.body ?? {},
  );

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  const problems = await databaseService.getAllProblems(validation.data);

  return response.json(problems);
}
