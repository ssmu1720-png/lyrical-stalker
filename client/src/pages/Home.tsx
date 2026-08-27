import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileJson,
  Github,
  Instagram,
  Loader2,
  Menu,
  Radio,
  Search,
  ShieldCheck,
  Terminal,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type Metadata = {
  username?: string;
  fullName?: string;
  posts?: string | number;
  followers?: string | number;
  following?: string | number;
  avatar?: string;
  bio?: string;
  [key: string]: unknown;
};

type ApiPayload = {
  status?: boolean;
  creator?: string;
  username?: string;
  result?: {
    metadata?: Metadata;
    stories?: {
      data?: Record<string, unknown>;
    };
  };
  [key: string]: unknown;
};

const API_ROOT = "https://api.kyzzz.xyz/api/stalker/ig";
const API_KEY = "kyzz60729265415646";

const starterFields = [
  ["result.metadata.username", "string"],
  ["result.metadata.fullName", "string"],
  ["result.metadata.posts", "string"],
  ["result.metadata.followers", "string"],
  ["result.metadata.following", "string"],
  ["result.metadata.avatar", "url"],
  ["result.metadata.bio", "string"],
  ["result.stories.data", "object"],
];

function getInitials(name?: string, handle?: string) {
  const source = (name || handle || "IG").trim();
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeHandle(value: string) {
  return value.trim().replace(/^@+/, "");
}

function valueOrDash(value: unknown) {
  return value === undefined || value === null || value === "" ? "—" : String(value);
}

function StatCell({ label, value, accent }: { label: string; value: unknown; accent?: boolean }) {
  return (
    <div className="stat-cell">
      <span className="data-label">{label}</span>
      <strong className={accent ? "stat-value stat-value-accent" : "stat-value"}>{valueOrDash(value)}</strong>
    </div>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-number">{number}</span>
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  // Terminal Noir: asymmetric operator console, warm dark surfaces, signal lime actions,
  // Space Grotesk for interface copy, IBM Plex Mono for data and API surfaces.
  const [username, setUsername] = useState("");
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [rawResponse, setRawResponse] = useState<unknown>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [requestInfo, setRequestInfo] = useState({ elapsed: "—", requestedAt: "—", httpStatus: "—" });
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const metadata = payload?.result?.metadata;
  const storiesData = payload?.result?.stories?.data;
  const normalized = normalizeHandle(username);
  const endpoint = normalized ? `${API_ROOT}?username=${encodeURIComponent(normalized)}&apikey=${API_KEY}` : `${API_ROOT}?username=__&apikey=${API_KEY}`;

  const responseKeys = useMemo(() => {
    if (!rawResponse || typeof rawResponse !== "object") return starterFields;
    const keys: Array<[string, string]> = [];
    const walk = (value: Record<string, unknown>, prefix = "") => {
      Object.entries(value).forEach(([key, child]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === "object" && !Array.isArray(child)) {
          walk(child as Record<string, unknown>, path);
        } else {
          keys.push([path, Array.isArray(child) ? "array" : typeof child]);
        }
      });
    };
    walk(rawResponse as Record<string, unknown>);
    return keys.slice(0, 12);
  }, [rawResponse]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function runLookup(event?: FormEvent) {
    event?.preventDefault();
    const handle = normalizeHandle(username);
    if (!handle) {
      inputRef.current?.focus();
      toast.error("Enter an Instagram handle first.");
      return;
    }

    const startedAt = performance.now();
    setStatus("loading");
    setErrorMessage("");
    setPayload(null);
    setRawResponse(null);
    setAvatarFailed(false);
    setRequestInfo((current) => ({ ...current, httpStatus: "…", elapsed: "…", requestedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }));

    try {
      const response = await fetch(`${API_ROOT}?username=${encodeURIComponent(handle)}&apikey=${API_KEY}`);
      const body = (await response.json()) as ApiPayload;
      const elapsed = Math.round(performance.now() - startedAt);
      setRawResponse(body);
      setRequestInfo({
        elapsed: `${elapsed} ms`,
        httpStatus: `${response.status} ${response.ok ? "OK" : "ERR"}`,
        requestedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });

      if (!response.ok || body.status === false) {
        throw new Error("The upstream service returned an unsuccessful response.");
      }

      setPayload(body);
      setStatus("success");
      toast.success(`Profile mapped: @${body.result?.metadata?.username || handle}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach the profile service.";
      setErrorMessage(message.includes("Failed to fetch") ? "The profile service could not be reached from this browser." : message);
      setStatus("error");
      toast.error("Lookup did not resolve.");
    }
  }

  async function copyEndpoint() {
    await navigator.clipboard.writeText(endpoint);
    toast.success("Request URL copied to clipboard.");
  }

  const profileHandle = metadata?.username || normalized;
  const rawText = rawResponse ? JSON.stringify(rawResponse, null, 2) : "// Waiting for a request…\n// Press / to focus the handle field.";

  return (
    <div className="console-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <aside className={`command-rail ${mobileRailOpen ? "command-rail-open" : ""}`}>
        <div className="rail-brand">
          <div className="brand-mark-wrap"><img src="/manus-storage/ig-stalker-mark_34fa3d50.png" alt="" className="brand-mark" /></div>
          <div>
            <span className="brand-kicker">IG / STALKER</span>
            <strong>console<span className="brand-dot">.</span></strong>
          </div>
          <button className="rail-close" aria-label="Close menu" onClick={() => setMobileRailOpen(false)}><X size={16} /></button>
        </div>

        <div className="rail-rule" />
        <div className="rail-context">
          <span className="data-label">WORKSPACE</span>
          <span className="rail-context-value"><span className="status-pip" />PUBLIC DATA</span>
        </div>
        <nav className="rail-nav" aria-label="Console navigation">
          <button className="rail-nav-item active"><Terminal size={16} /><span>Inspector</span><ChevronRight size={13} /></button>
          <button className="rail-nav-item" onClick={() => toast.info("History is available after your first lookup.")}><Clock3 size={16} /><span>Request history</span></button>
          <button className="rail-nav-item" onClick={() => toast.info("Schema view is tied to the active response.")}><FileJson size={16} /><span>Response schema</span></button>
        </nav>

        <div className="rail-bottom">
          <div className="rail-note">
            <ShieldCheck size={15} />
            <p>Only public profile surfaces are requested. No login required.</p>
          </div>
          <div className="rail-footer"><span>v2.0.4</span><span>KYZZ API</span></div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileRailOpen(true)}><Menu size={18} /></button>
          <div className="crumbs"><span>workspace</span><ChevronRight size={13} /><strong>profile-inspector</strong></div>
          <div className="topbar-meta"><span className="live-dot" /> <span>service online</span><span className="topbar-separator" /><span>read-only</span></div>
        </header>

        <div className="workspace-content">
          <section className="hero-block">
            <div className="hero-art" aria-hidden="true" />
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> PUBLIC PROFILE LOOKUP</div>
              <h1>Inspect a<br /><em>public profile.</em></h1>
              <p className="hero-subcopy">Enter a handle and map the surface. Fast, structured, and deliberately transparent.</p>
            </div>
            <div className="hero-aside">
              <div className="hero-aside-label">DATA SURFACE <span>01</span></div>
              <p>Metadata, audience counts, bio, avatar, and story service state.</p>
              <div className="hero-aside-rule" />
              <span className="mono-muted">GET /api/stalker/ig</span>
            </div>
          </section>

          <section className="query-panel panel-surface">
            <div className="panel-heading-row">
              <SectionLabel number="00">REQUEST</SectionLabel>
              <span className="mono-muted">POSTMAN / READY</span>
            </div>
            <form onSubmit={runLookup} className="query-form">
              <div className="input-shell">
                <span className="input-prefix">@</span>
                <input ref={inputRef} value={username} onChange={(event) => setUsername(event.target.value)} placeholder="enter_handle" aria-label="Instagram handle" autoComplete="off" spellCheck={false} />
                <kbd>/</kbd>
              </div>
              <Button type="submit" className="execute-button" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
                {status === "loading" ? "Mapping…" : "Run lookup"}
                <ArrowUpRight size={15} />
              </Button>
            </form>
            <div className="route-row">
              <div className="route-status"><span className={`route-pip ${status === "error" ? "route-pip-error" : status === "success" ? "route-pip-success" : ""}`} /> <span className="mono-muted">GET</span><code>{API_ROOT}</code></div>
              <button className="copy-button" onClick={copyEndpoint}><Copy size={13} /> COPY REQUEST</button>
            </div>
          </section>

          {status === "error" && (
            <section className="error-panel panel-surface">
              <div className="error-icon"><X size={16} /></div>
              <div><strong>Request could not resolve.</strong><p>{errorMessage}</p></div>
              <button onClick={() => runLookup()} className="try-again">Try again <ArrowUpRight size={14} /></button>
            </section>
          )}

          {status === "idle" && (
            <section className="empty-readout panel-surface">
              <div className="empty-art"><Activity size={24} /></div>
              <div><SectionLabel number="01">AWAITING INPUT</SectionLabel><h2>No profile loaded yet.</h2><p>Run a lookup to populate the identity, audience, and service panels with the API response.</p></div>
              <div className="empty-aside"><span className="mono-muted">TIP</span><strong>Use @ or plain handle</strong><span className="mono-muted">ENTER TO EXECUTE</span></div>
            </section>
          )}

          {status === "loading" && (
            <section className="loading-readout panel-surface">
              <div className="loading-beacon"><Radio size={22} /></div>
              <div><SectionLabel number="01">MAPPING SURFACE</SectionLabel><h2>Reading @{normalized}</h2><p>Waiting for the upstream profile service to return its payload.</p></div>
              <div className="scan-lines"><span /><span /><span /><span /></div>
            </section>
          )}

          {status === "success" && metadata && (
            <>
              <section className="profile-grid">
                <div className="profile-card panel-surface">
                  <div className="panel-heading-row"><SectionLabel number="01">IDENTITY</SectionLabel><span className="verified-tag"><Check size={12} /> RESOLVED</span></div>
                  <div className="identity-row">
                    <div className="avatar-frame">
                      {metadata.avatar && !avatarFailed ? <img src={metadata.avatar} alt={`${valueOrDash(metadata.fullName)} profile avatar`} onError={() => setAvatarFailed(true)} /> : <div className="avatar-fallback">{getInitials(metadata.fullName, profileHandle)}</div>}
                      <span className="avatar-corner" />
                    </div>
                    <div className="identity-copy"><span className="handle">@{valueOrDash(profileHandle)}</span><h2>{valueOrDash(metadata.fullName)}</h2><span className="identity-source"><Instagram size={13} /> instagram / public</span></div>
                  </div>
                  <p className="bio">{valueOrDash(metadata.bio)}</p>
                  <div className="identity-footer"><span className="mono-muted">SOURCE / KYZZ</span><a href={`https://www.instagram.com/${profileHandle}`} target="_blank" rel="noreferrer">Open profile <ExternalLink size={13} /></a></div>
                </div>
                <div className="audience-card panel-surface">
                  <div className="panel-heading-row"><SectionLabel number="02">AUDIENCE</SectionLabel><Eye size={16} className="muted-icon" /></div>
                  <div className="stats-grid">
                    <StatCell label="posts" value={metadata.posts} accent />
                    <StatCell label="followers" value={metadata.followers} accent />
                    <StatCell label="following" value={metadata.following} />
                  </div>
                  <div className="audience-footer"><span className="signal-bar" /><span>public counters returned as strings</span></div>
                </div>
              </section>

              <section className="lower-grid">
                <div className="schema-card panel-surface">
                  <div className="panel-heading-row"><SectionLabel number="03">RESPONSE SCHEMA</SectionLabel><span className="mono-muted">{responseKeys.length} KEYS</span></div>
                  <div className="schema-list">{responseKeys.map(([key, type]) => <div className="schema-row" key={key}><span className="schema-key">{key}</span><span className="schema-type">{type}</span><Check size={13} /></div>)}</div>
                  <div className="schema-footnote"><Code2 size={14} /><span>Nested keys are derived from the live payload.</span></div>
                </div>
                <div className="service-card panel-surface">
                  <div className="service-visual" aria-hidden="true" />
                  <div className="service-content"><div className="panel-heading-row"><SectionLabel number="04">STORY SERVICE</SectionLabel><span className={`service-status ${storiesData?.status === "error" ? "service-status-error" : ""}`}><span /> {valueOrDash(storiesData?.status).toUpperCase()}</span></div><h3>{storiesData?.status === "error" ? "Stories not available." : "Stories service responded."}</h3><p>The endpoint returned a service state alongside the profile metadata.</p><div className="service-meta"><span><span className="data-label">COUNTRY</span><strong>{valueOrDash(storiesData?.country)}</strong></span><span><span className="data-label">SERVER CODE</span><strong>{valueOrDash(storiesData?.serverCode)}</strong></span></div></div>
                </div>
              </section>

              <section className="raw-card panel-surface">
                <div className="raw-heading"><div><SectionLabel number="05">RAW RESPONSE</SectionLabel><p>Original payload returned by the upstream service.</p></div><div className="raw-meta"><span><span className="data-label">HTTP</span><strong>{requestInfo.httpStatus}</strong></span><span><span className="data-label">TIME</span><strong>{requestInfo.elapsed}</strong></span><span><span className="data-label">AT</span><strong>{requestInfo.requestedAt}</strong></span></div></div>
                <div className="code-window"><div className="code-window-top"><span><i /><i /><i /></span><span className="mono-muted">response.json</span><span className="mono-muted">UTF-8</span></div><pre>{rawText}</pre></div>
              </section>
            </>
          )}

          <footer className="workspace-footer"><span><span className="status-pip" /> Public data surface / use responsibly</span><span>Built for inspection <span className="footer-mark">◆</span></span><span className="footer-links"><a href="https://github.com" target="_blank" rel="noreferrer"><Github size={13} /> source</a><button onClick={() => toast.info("This interface reads only the public response returned by the configured service.")}><CircleHelp size={13} /> about</button></span></footer>
        </div>
      </main>
    </div>
  );
}
