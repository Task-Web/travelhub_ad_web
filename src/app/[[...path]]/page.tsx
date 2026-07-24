import { cookies, headers } from "next/headers";
import { COOKIE_NAME } from "@/lib/cookies";
import { createTask052PageToken } from "@/lib/task052-click-sessions";
import ClientRouter from "./ClientRouter";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface CatchAllPageProps {
  params?: Promise<{ path?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatchAllPage({
  params,
  searchParams,
}: CatchAllPageProps) {
  const routePath = (await params)?.path?.join("/") ?? "";
  if (routePath === "state-manage" || routePath === "state-doc") notFound();
  const queryParams = (await searchParams) ?? {};
  const hasCookieOverride = queryParams.cookie !== undefined;
  const requestHeaders = await headers();
  const isDocumentNavigation =
    requestHeaders.get("x-task052-document-navigation") === "1";
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  const task052PageToken =
    !hasCookieOverride && isDocumentNavigation && userId
      ? await createTask052PageToken(userId)
      : null;

  return <ClientRouter task052PageToken={task052PageToken} />;
}
