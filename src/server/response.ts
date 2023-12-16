import type { NextApiResponse } from "next";

export function unauthenticatedResponse(response: NextApiResponse) {
  return response.status(401).json({
    message: "Unauthenticated.",
  });
}

export function invalidPayloadResponse(
  response: NextApiResponse,
  errors?: Record<string, string>,
) {
  return response.status(422).json({
    message: "Invalid data provided.",
    ...errors,
  });
}
