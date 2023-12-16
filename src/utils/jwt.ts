import Jwt from "jsonwebtoken";

import { env } from "@/env";

export function createToken(
  payload: Record<string, string>,
  expiresIn: number,
) {
  return Jwt.sign(payload, env.IRON_SESSION_PASSWORD, {
    expiresIn,
  });
}
