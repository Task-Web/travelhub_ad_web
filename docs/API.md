# API Reference

Base path: `/api` (same origin)

All endpoints assume cookie-based user identification. A new `user_id` cookie is issued on first request. Include credentials on cross-site calls.

## Health
- `GET /api/health` — liveness probe. Response: `{"status":"ok"}`.
- `GET /health` — alias for load balancers.

## State
- `GET /state` — fetch current state for this cookie.
  - Response `200`: `{ "user_id": "uuid", "state": { "meta": {...}, "data": {...}, "note": "..." } }`
- `PUT /state` — replace the entire state payload.
  - Body: `{ "data": { ... }, "note": "optional string", "meta": { ... } }`
  - Response: same shape as GET.
- `PATCH /state` — deep-merge into the existing `data` field.
  - Body: `{ "data": { ... }, "note": "optional string" }`
  - Response: merged state.
- `DELETE /state` — reset state to defaults and clear files.
  - Response: `{ "user_id": "...", "state": { "meta": {...}, "data": {...}, "note": null } }`

Notes:
- `meta.version` increments on patch/merge operations; resets on replace/reset.
- `meta.created_at` and `updated_at` are UTC ISO timestamps.
- Default state includes an example Hugging Face file URL under `data.examples.huggingface_file`.
- File uploads live in server storage and are referenced by URL under `data.uploads`.

## Files
- `POST /files` — upload one or more files (multipart form, field name `files`).
  - Response `200`: `[{ "id": "...", "name": "report.pdf", "size": 123, "type": "application/pdf", "url": "/api/files/<stored>", "filename": "<stored>" }]`
- `GET /files` — list files for the current user.
  - Response `200`: same array shape as upload response.
- `GET /files/{filename}` — fetch a file scoped to the current cookie.
  - Response `200`: binary file response.

## Domain APIs (state-driven)
- `GET /airports` — query by `q`.
- `GET /flights` — filter by `origin`, `destination`, `cabin_class`, `direct_only`.
- `GET /flights/{id}` — fetch a flight by id.
- `GET /hotels` — filter by `city`, `country`, `property_type`, `min_rating`, `max_price`.
- `GET /hotels/{id}` — fetch a hotel by id.
- `GET /cars` — filter by `location`, `car_type`.
- `GET /attractions` — filter by `city`, `category`.
- `GET /packages` — filter by `origin`, `destination`.
- `GET/POST /bookings` — list or create bookings.
- `GET/POST/DELETE /cart` and `/cart/items` — cart operations.
- `GET/PATCH /preferences` — user preferences.
- `GET/PATCH /search` — search history state.
- `GET/POST /disputes` — dispute submissions.

## Required interface

Any site built on `basesite` must keep the `/state-manage` interface with both the documentation
and the live editor tabs. This page is the canonical place to inspect and update per-user state
and must not be removed.

## Info
- `GET /info` — return runtime and request context for debugging.
  - Response example:
    ```json
    {
      "app_name": "TravelHub Web",
      "node_version": "v22.0.0",
      "env": { "node_version": "v22.0.0", "platform": "linux", "env_mode": "development" },
      "request": { "client": "127.0.0.1", "headers": { }, "path": "/api/info", "method": "GET", "user_id": "..." }
    }
    ```

## MCP (streamable HTTP subset)
- `GET /mcp` — returns available tool metadata.
- `POST /mcp` — JSON-RPC 2.0 `tools/list` and `tools/call` (tools: `info`, `get_state`, `replace_state`, `patch_state`, `reset_state`).

## Usage examples

`curl` (remember cookies):
```bash
curl -i -c cookies.txt http://localhost:3000/api/state
curl -b cookies.txt -X PATCH http://localhost:3000/api/state \
  -H "Content-Type: application/json" \
  -d '{"data": {"step": 2, "parameters": {"alpha": 0.1}}, "note": "patched via curl"}'
curl -b cookies.txt http://localhost:3000/api/info
curl -b cookies.txt -F "files=@./report.pdf" http://localhost:3000/api/files
```

`httpie`:
```bash
http --print=HBhb GET :3000/api/state
http --print=HBhb PATCH :3000/api/state data:='{"foo": "bar"}'
http DELETE :3000/api/state
```

## Error shape
- HTTP errors return `{ "detail": "message" }`.
