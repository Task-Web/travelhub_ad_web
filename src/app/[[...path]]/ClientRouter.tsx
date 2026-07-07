"use client";

import Router from "@/Router";
import { setTask052PageToken } from "@/lib/task052-client";

interface ClientRouterProps {
  task052PageToken: string | null;
}

export default function ClientRouter({ task052PageToken }: ClientRouterProps) {
  setTask052PageToken(task052PageToken);

  return <Router />;
}
