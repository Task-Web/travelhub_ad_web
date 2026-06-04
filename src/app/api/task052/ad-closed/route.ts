import { NextRequest } from "next/server";
import { createResponseWithCookie, getUserId } from "@/lib/cookies";
import { patchTask052Flow } from "@/lib/task052-flow";

// POST /api/task052/ad-closed - Record closing the search-page ad popup.
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  const flow = await patchTask052Flow(
    userId,
    { ad_closed: true },
    "Task 052 ad closed"
  );

  return createResponseWithCookie({ allowed: true, flow }, userId);
}
