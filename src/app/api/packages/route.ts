import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

// GET /api/packages - Search flight+hotel packages from user state
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  const state = await stateStore.getState(userId);
  const params = request.nextUrl.searchParams;

  const origin = params.get("origin");
  const destination = params.get("destination");

  let packages = (state.data as Record<string, unknown>).packages as
    | Record<string, unknown>[]
    | undefined;
  packages = Array.isArray(packages) ? packages : [];

  if (origin) {
    const target = origin.toLowerCase();
    packages = packages.filter((pkg) =>
      String(pkg.origin ?? "").toLowerCase().includes(target)
    );
  }

  if (destination) {
    const target = destination.toLowerCase();
    packages = packages.filter((pkg) =>
      String(pkg.destination ?? "").toLowerCase().includes(target)
    );
  }

  return createResponseWithCookie(
    { packages, count: packages.length },
    userId
  );
}
