import { useEffect, useMemo, useState } from "react";
import { api } from "./apiClient";

const defaultPayload = `{
  "experiment": { "step": 1, "status": "draft" },
  "inputs": { "a": 1, "b": 2 },
  "notes": "edit and send to the backend"
}`;

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "user_id";
const COOKIE_MAX_AGE = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE || 60 * 60 * 24 * 30);

// this function checks the URL for a "cookie" query parameter,
// sets the cookie accordingly, and reloads the page without the query parameter
// when build on the basesite, the below function should remain unchanged
const applyCookieFromQuery = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const override = url.searchParams.get("cookie");
  if (!override) return false;
  let cookie = `${COOKIE_NAME}=${encodeURIComponent(override)}; Path=/; SameSite=Lax`;
  if (Number.isFinite(COOKIE_MAX_AGE) && COOKIE_MAX_AGE > 0) {
    cookie += `; Max-Age=${Math.floor(COOKIE_MAX_AGE)}`;
  }
  document.cookie = cookie;
  const redirectUrl = url.origin;
  if (window.location.href !== redirectUrl) {
    window.location.replace(redirectUrl);
    return true;
  }
  return false;
};

function App() {
  const [state, setState] = useState(null);
  const [info, setInfo] = useState(null);
  const [editor, setEditor] = useState(defaultPayload);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const userId = useMemo(() => state?.user_id || "pending cookie", [state]);

  const handleError = (err) => {
    console.error(err);
    setMessage(err.message || "Request failed");
  };

  const refreshState = async () => {
    try {
      setLoading(true);
      const next = await api.getState();
      setState(next);
      setNote(next.state.note || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInfo = async () => {
    try {
      const details = await api.getInfo();
      setInfo(details);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const redirected = applyCookieFromQuery();
    if (redirected) return;
    refreshState();
    refreshInfo();
  }, []);

  const parseEditor = () => {
    try {
      return JSON.parse(editor);
    } catch (err) {
      throw new Error("Editor content is not valid JSON.");
    }
  };

  const runReplace = async () => {
    setMessage("");
    try {
      setLoading(true);
      const payload = parseEditor();
      const next = await api.replaceState(payload, note || undefined);
      setState(next);
      setMessage("State replaced.");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const runPatch = async () => {
    setMessage("");
    try {
      setLoading(true);
      const payload = parseEditor();
      const next = await api.patchState(payload, note || undefined);
      setState(next);
      setMessage("State patched.");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const runReset = async () => {
    setMessage("");
    try {
      setLoading(true);
      const next = await api.resetState();
      setState(next);
      setNote("");
      setEditor(defaultPayload);
      setMessage("State reset.");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const runUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Select a file to upload.");
      return;
    }
    setUploadStatus("");
    try {
      setLoading(true);
      const uploads = Array.isArray(state?.state?.data?.uploads)
        ? state.state.data.uploads
        : [];
      const uploaded = await api.uploadFiles([selectedFile]);
      const uploadedFiles = Array.isArray(uploaded)
        ? uploaded
        : uploaded?.files || [];
      const stampedUploads = uploadedFiles.map((file) => ({
        ...file,
        uploaded_at: new Date().toISOString(),
      }));
      const nextUploads = [...uploads, ...stampedUploads];
      await api.patchState({ uploads: nextUploads });
      await refreshState();
      setSelectedFile(null);
      setUploadStatus("File uploaded to server storage.");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const runDeleteFile = async (index) => {
    try {
      setLoading(true);
      const uploads = Array.isArray(state?.state?.data?.uploads)
        ? state.state.data.uploads
        : [];
      const nextUploads = uploads.filter((_, idx) => idx !== index);
      await api.patchState({ uploads: nextUploads });
      await refreshState();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const buildHfDownloadUrl = (url) => {
    if (!url) return null;
    if (url.includes("/blob/")) {
      return url.replace("/blob/", "/resolve/");
    }
    return url;
  };

  const resolveFileUrl = (url) => {
    if (!url) return "";
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    const baseOrigin = api.baseUrl ? api.baseUrl.replace(/\/api\/?$/, "") : "";
    if (!baseOrigin) return url;
    if (url.startsWith("/")) {
      return `${baseOrigin}${url}`;
    }
    return `${baseOrigin}/${url}`;
  };

  const triggerDownload = (url, filename) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    if (filename) {
      link.download = filename;
    }
    link.rel = "noopener";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadExample = () => {
    const exampleUrl = state?.state?.data?.examples?.huggingface_file?.url;
    const downloadUrl = buildHfDownloadUrl(exampleUrl);
    triggerDownload(downloadUrl, "email_031.tar.gz");
  };

  const mcpUrl = useMemo(() => {
    if (!api.baseUrl) return "";
    return api.baseUrl.replace(/\/api\/?$/, "") + "/mcp";
  }, []);

  const mcpConfig = JSON.stringify(
    {
      name: "basesite-mcp",
      transport: "streamable_http",
      url: mcpUrl,
    },
    null,
    2
  );

  const prettyState = state ? JSON.stringify(state.state, null, 2) : "// no state yet";
  const infoText = info ? JSON.stringify(info, null, 2) : "// loading info";

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 pb-12 pt-10">
      <header className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Base Experiment Surface
          </p>
          <h1 className="font-display text-3xl text-white md:text-4xl">
            Per-user state playground
          </h1>
          <p className="max-w-2xl text-slate-300">
            Cookie-based identity, explicit state controls, and system visibility for experiments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
            User cookie: {userId}
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
            API base: {api.baseUrl}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-xl bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5"
            onClick={refreshState}
            disabled={loading}
          >
            Refresh state
          </button>
          <button
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:-translate-y-0.5"
            onClick={refreshInfo}
            disabled={loading}
          >
            Refresh info
          </button>
          <button
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:-translate-y-0.5"
            onClick={downloadExample}
            disabled={loading || !state?.state?.data?.examples?.huggingface_file?.url}
          >
            Download HF example
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="lg:col-span-1 rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                State editor
              </p>
              <h3 className="font-display text-xl text-white">Compose payload</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-xl bg-emerald-300/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                onClick={runPatch}
                disabled={loading}
              >
                PATCH merge
              </button>
              <button
                className="rounded-xl bg-blue-300/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                onClick={runReplace}
                disabled={loading}
              >
                PUT replace
              </button>
              <button
                className="rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                onClick={runReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-300">
              <span>Note (optional)</span>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 font-mono text-sm text-white outline-none ring-1 ring-transparent transition focus:ring-cyan-400/60"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Short note describing this state"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              <span>JSON payload</span>
              <textarea
                className="min-h-[240px] w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-sm text-white outline-none ring-1 ring-transparent transition focus:ring-cyan-400/60"
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                spellCheck={false}
              />
            </label>
            {message && <p className="text-sm text-emerald-200">{message}</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Current state
              </p>
              <h3 className="font-display text-xl text-white">Server view</h3>
            </div>
            <button
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
              onClick={refreshState}
              disabled={loading}
            >
              Pull latest
            </button>
          </div>
          <pre className="mt-4 min-h-[240px] overflow-auto rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-slate-200">
            {prettyState}
          </pre>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Uploads</p>
              <h3 className="font-display text-xl text-white">Stored files</h3>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1 file:text-sm file:text-white"
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
            <button
              className="rounded-xl bg-amber-300/90 px-4 py-2 text-sm font-semibold text-slate-900"
              onClick={runUpload}
              disabled={loading}
            >
              Upload
            </button>
          </div>
          {uploadStatus && <p className="mt-2 text-sm text-emerald-200">{uploadStatus}</p>}
          <div className="mt-4 grid gap-2">
            {(state?.state?.data?.uploads || []).length === 0 ? (
              <p className="text-sm text-slate-400">No uploaded files for this user.</p>
            ) : (
              (state.state.data.uploads || []).map((file, index) => {
                const displayName = file.name || file.filename || "file";
                const contentType =
                  file.type || file.content_type || "application/octet-stream";
                const downloadUrl = resolveFileUrl(file.url || file.content_base64);
                return (
                  <div
                    key={`${file.id || file.filename || displayName}-${file.uploaded_at || index}`}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">{displayName}</div>
                      <div className="text-xs text-slate-400">
                        {contentType} • {file.size} bytes
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                        onClick={() => triggerDownload(downloadUrl, displayName)}
                        disabled={loading || !downloadUrl}
                      >
                        Download
                      </button>
                      <button
                        className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                        onClick={() => runDeleteFile(index)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Backend info
              </p>
              <h3 className="font-display text-xl text-white">System + request</h3>
            </div>
            <button
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
              onClick={refreshInfo}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
          <pre className="mt-4 min-h-[220px] overflow-auto rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-slate-200">
            {infoText}
          </pre>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">MCP</p>
              <h3 className="font-display text-xl text-white">Streamable HTTP config</h3>
            </div>
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-slate-950/60 p-4 font-mono text-xs text-slate-200">
            {mcpConfig}
          </pre>
        </section>
      </main>
    </div>
  );
}

export default App;
