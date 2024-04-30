import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import prisma from "@/server/prisma";
import { invalidPayloadResponse } from "@/server/response";

const GetTemplateFilesSchema = z.object({
  templateId: z.string(),
});

export default async function getTemplateFiles(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const validation = await GetTemplateFilesSchema.safeParseAsync(request.body);

  if (!validation.success) {
    return invalidPayloadResponse(response);
  }

  const template = await prisma.template.findFirst({
    where: {
      id: validation.data.templateId,
    },
    include: {
      starterFiles: true,
    },
  });

  return response.json(template);
}
