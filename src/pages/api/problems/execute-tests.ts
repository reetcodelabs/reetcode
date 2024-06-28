import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import { invalidPayloadResponse } from "@/server/response";
import { parseRuntimeOutputJestTests, rceClient, STUBS } from "@/utils/rce";
import { withIronSessionApiRoute } from "@/utils/session";

import { handleSaveSolution } from "./save-solution";

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

  const userId = request.session?.user?.id;

  if (userId) {
    await handleSaveSolution(request, response, true);
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

  const allowedFiles = validation?.data?.files
    ?.filter(
      (file) =>
        !file?.path?.includes("test.spec") &&
        !file?.path?.includes("tests.spec") &&
        file?.code &&
        !Object?.keys(STUBS).some((stub) => stub.includes(file?.path)) &&
        !["package.json", "package-lock.json"].some((forbiddenFile) =>
          file?.path?.includes(forbiddenFile),
        ) &&
        template?.editableFiles?.some((f: string) => file?.path.includes(f)),
    )
    .map((f) => ({ code: f.code, path: f.path.split("/")[1] }));

  const otherTemplateFiles = template?.starterFiles
    ?.filter((file) => !template.editableFiles.includes(file.path))
    .map((file) => ({
      name: file?.path,
      code: file.content,
      entrypoint: false,
    }));

  try {
    const payload = {
      language: "Javascript",
      files: [
        {
          name: "test.mjs",
          code: STUBS["test.mjs"],
          entrypoint: true,
        },
        // {
        //   name: testFile?.path?.startsWith("tests/")
        //     ? testFile?.path
        //     : `tests/${testFile?.path}`,
        //   code: testFile?.content,
        //   entrypoint: false,
        // },
        ...allowedFiles.map((file) => ({
          code: file.code,
          name: file?.path,
          entrypoint: false,
        })),
        ...otherTemplateFiles,
      ],
    };

    const rceResponse = await rceClient.post<{ runtime: { output: string } }>(
      "/execute",
      payload,
    );

    const results = await parseRuntimeOutputJestTests(
      rceResponse.data.runtime.output,
    );

    if (
      userId &&
      results.summary.total == results.summary.passed &&
      results.summary.passed > 0
    ) {
      await prisma.solution.update({
        where: {
          problemId_userId_templateId: {
            userId,
            problemId: validation.data.problemId,
            templateId: validation.data.templateId,
          },
        },
        data: {
          completedAt: new Date(),
        },
      });
    }

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

export default withIronSessionApiRoute(handleExecuteProblemTests);
