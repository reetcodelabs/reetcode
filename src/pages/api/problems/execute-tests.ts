import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import { invalidPayloadResponse } from "@/server/response";
import { parseRuntimeOutputJestTests, rceClient, STUBS } from "@/utils/rce";
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

export async function handleExecuteProblemTests(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = await ExecuteTestsSchema.safeParseAsync(
    request.body ?? {},
  );

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  const template = await prisma.template.findFirst({
    where: {
      AND: [
        {
          id: validation.data.templateId,
        },
        {
          problemId: validation.data.problemId,
        },
      ],
    },
    include: {
      starterFiles: true,
    },
  });

  if (!template) {
    return invalidPayloadResponse(response);
  }

  const testFile = template.starterFiles.find((file) =>
    file.path.includes("tests.spec.") || file.path.includes('test.spec.'),
  );

  try {
    const rceResponse = await rceClient.post<{ runtime: { output: string } }>(
      "/execute",
      {
        language: "Javascript",
        files: [
          {
            name: "test.js",
            code: STUBS["test.jest.js"],
            entrypoint: true,
          },
          {
            name: "babel.config.json",
            code: STUBS["babel.config.json"],
            entrypoint: false,
          },
          {
            name: testFile?.path?.startsWith("tests/")
              ? testFile?.path
              : `tests/${testFile?.path}`,
            code: testFile?.content,
            entrypoint: false,
          },
          // ...
        ],
      },
    );

    const results = await parseRuntimeOutputJestTests(
      rceResponse.data.runtime.output,
    );

    console.log({results})

    return response.json({
      data: results,
    });
  } catch (error) {
    console.error("@@@error", error);

    return response.status(400).json({
      message: "Failed to run tests. Please try again.",
    });
  }
}

export default withIronSessionApiRoute(handleExecuteProblemTests)
