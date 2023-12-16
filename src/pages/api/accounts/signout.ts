import type { NextApiRequest, NextApiResponse } from "next";

import { withIronSessionApiRoute } from "@/utils/session";

export async function signOutSession(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = request.session;

  session.destroy();

  return response.json({ message: "Successfully logged you out." });
}

export default withIronSessionApiRoute(signOutSession);
