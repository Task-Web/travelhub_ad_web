import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

const buildResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("App", () => {
  const statePayload = {
    user_id: "test-user",
    state: {
      meta: { created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z", version: 1 },
      data: { sample: true },
      note: null,
    },
  };

  const infoPayload = {
    app_name: "Base Experiment Backend",
    python_version: "3.11.0",
    env: { python_version: "3.11.0", platform: "test-os", env_mode: "dev" },
    request: { client: "127.0.0.1", headers: {}, path: "/api/info", method: "GET", user_id: "test-user" },
  };

  beforeEach(() => {
    const responses = [statePayload, infoPayload];
    global.fetch = vi.fn(async () => {
      const next = responses.shift();
      return buildResponse(next ?? {});
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders user cookie and state payload", async () => {
    render(<App />);

    expect(await screen.findByText(/User cookie: test-user/)).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByText(/Server view/i)).toBeInTheDocument();
    expect(screen.getByText(/Per-user state playground/i)).toBeInTheDocument();
  });

  it("shows default editor content", async () => {
    render(<App />);
    await screen.findByText(/User cookie: test-user/);
    const textarea = screen.getByRole("textbox", { name: /json payload/i });
    expect(textarea.value).toMatch(/\"experiment\"/);
  });
});
