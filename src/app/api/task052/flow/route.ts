import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { getTask052Flow } from "@/lib/task052-flow";

// GET /api/task052/flow - Retrieve task 052 flow state for this user.
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const { flow, initialized } = await getTask052Flow(userId);

  return createResponseWithCookie({ flow, initialized }, userId);
}
