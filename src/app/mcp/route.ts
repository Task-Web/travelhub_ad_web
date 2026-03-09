import { NextRequest, NextResponse } from "next/server";
import os from "os";
import { getUserId, setUserCookie } from "@/lib/cookies";
import { stateStore } from "@/lib/state-store";

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

const APP_NAME = process.env.APP_NAME || "TravelHub Web";

const TOOL_DEFS = [
  {
    name: "get_state",
    description: "Retrieve the current user state.",
    inputSchema: { type: "object", properties: { user_cookie: { type: "string" } } },
  },
  {
    name: "replace_state",
    description: "Replace the entire user state.",
    inputSchema: {
      type: "object",
      properties: {
        user_cookie: { type: "string" },
        data: { type: "object" },
        note: { type: "string" },
        meta: { type: "object" },
      },
    },
  },
  {
    name: "patch_state",
    description: "Patch (deep merge) into user state.",
    inputSchema: {
      type: "object",
      properties: {
        user_cookie: { type: "string" },
        data: { type: "object" },
        note: { type: "string" },
      },
    },
  },
  {
    name: "reset_state",
    description: "Reset user state to defaults.",
    inputSchema: { type: "object", properties: { user_cookie: { type: "string" } } },
  },
  {
    name: "info",
    description: "Return backend environment info and resolved user id.",
    inputSchema: { type: "object", properties: { user_cookie: { type: "string" } } },
  },
];

function jsonRpcResponse(id: JsonRpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function jsonRpcError(id: JsonRpcRequest["id"], message: string, code = -32603) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function resolveUserId(request: NextRequest, userCookie?: string) {
  if (userCookie) {
    return userCookie;
  }
  return getUserId(request);
}

async function handleToolCall(
  request: NextRequest,
  toolName: string,
  args: Record<string, unknown>
) {
  const userCookie = args.user_cookie as string | undefined;
  const userId = await resolveUserId(request, userCookie);

  switch (toolName) {
    case "get_state": {
      const state = await stateStore.getState(userId);
      return { user_id: userId, state };
    }
    case "replace_state": {
      const data = (args.data as Record<string, unknown>) || {};
      const note = (args.note as string | undefined) ?? null;
      const meta = (args.meta as Record<string, unknown>) || undefined;
      const state = await stateStore.replaceState(userId, { data, note, meta });
      return { user_id: userId, state };
    }
    case "patch_state": {
      const data = (args.data as Record<string, unknown>) || {};
      const note = (args.note as string | undefined) ?? null;
      const state = await stateStore.patchState(userId, data, note);
      return { user_id: userId, state };
    }
    case "reset_state": {
      const state = await stateStore.resetState(userId);
      return { user_id: userId, state };
    }
    case "info": {
      const runtimeEnv: Record<string, string> = {
        node_version: process.version,
        platform: os.platform(),
        env_mode: process.env.NODE_ENV || "development",
      };
      return {
        app_name: APP_NAME,
        user_id: userId,
        env: runtimeEnv,
      };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

function wrapToolResult(result: unknown) {
  return {
    content: [
      {
        type: "json",
        json: result,
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ tools: TOOL_DEFS });
  const userId = await getUserId(request);
  setUserCookie(response, userId);
  return response;
}

export async function POST(request: NextRequest) {
  let payload: JsonRpcRequest;
  try {
    payload = (await request.json()) as JsonRpcRequest;
  } catch {
    return NextResponse.json(
      jsonRpcError(null, "Invalid JSON body", -32700),
      { status: 400 }
    );
  }

  if (!payload.method) {
    return NextResponse.json(
      jsonRpcError(payload.id, "Missing method", -32600),
      { status: 400 }
    );
  }

  if (payload.method === "tools/list") {
    const response = NextResponse.json(
      jsonRpcResponse(payload.id, { tools: TOOL_DEFS })
    );
    const userId = await getUserId(request);
    setUserCookie(response, userId);
    return response;
  }

  if (payload.method === "tools/call") {
    const params = payload.params || {};
    const toolName = params.name as string;
    const args = (params.arguments as Record<string, unknown>) || {};
    try {
      const result = await handleToolCall(request, toolName, args);
      const response = NextResponse.json(
        jsonRpcResponse(payload.id, wrapToolResult(result))
      );
      const userId = await resolveUserId(request, args.user_cookie as string | undefined);
      setUserCookie(response, userId);
      return response;
    } catch (error) {
      return NextResponse.json(
        jsonRpcError(payload.id, (error as Error).message),
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    jsonRpcError(payload.id, `Unsupported method: ${payload.method}`, -32601),
    { status: 400 }
  );
}
