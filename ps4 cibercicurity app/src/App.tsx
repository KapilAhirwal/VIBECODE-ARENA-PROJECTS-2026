import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  FileImage,
  FileText,
  Fingerprint,
  Globe2,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { analyze } from "./detector";
import { HeroScrollDemo } from "./components/ui/container-scroll-demo";
type Page =
  | "Dashboard"
  | "Demo Message Inbox"
  | "Message Scanner"
  | "URL Scanner"
  | "Screenshot Scanner"
  | "SafeVault"
  | "Cyber Emergency"
  | "Incident Reports"
  | "AI Assistant"
  | "Learning Centre"
  | "Scroll Animation Demo"
  | "Scam Pattern Radar"
  | "Admin Analytics"
  | "Settings & Privacy";
type Scan = {
  id: string;
  text: string;
  risk: number;
  level: string;
  category: string;
  indicators: string[];
  time: string;
  status?: string;
  notes?: string;
};
const nav: { label: Page; icon: any; group: string }[] = [
  { label: "Dashboard", icon: LayoutDashboard, group: "WORKSPACE" },
  { label: "Demo Message Inbox", icon: Inbox, group: "WORKSPACE" },
  { label: "Message Scanner", icon: MessageSquareText, group: "WORKSPACE" },
  { label: "URL Scanner", icon: Globe2, group: "WORKSPACE" },
  { label: "Screenshot Scanner", icon: FileImage, group: "WORKSPACE" },
  { label: "SafeVault", icon: Inbox, group: "PROTECT" },
  { label: "Cyber Emergency", icon: LifeBuoy, group: "PROTECT" },
  { label: "Incident Reports", icon: FileText, group: "PROTECT" },
  { label: "AI Assistant", icon: Bot, group: "LEARN" },
  { label: "Learning Centre", icon: BookOpen, group: "LEARN" },
  { label: "Scroll Animation Demo", icon: Sparkles, group: "LEARN" },
  { label: "Scam Pattern Radar", icon: Activity, group: "INSIGHTS" },
  { label: "Admin Analytics", icon: Shield, group: "INSIGHTS" },
  { label: "Settings & Privacy", icon: Settings, group: "SYSTEM" },
];
const seed: Scan[] = [
  {
    id: "S-4821",
    text: "Your account will be suspended today. Verify your KYC now: http://sbi-kyc-alert.example.in",
    risk: 91,
    level: "High",
    category: "Phishing",
    indicators: ["Urgent threat", "KYC request", "Suspicious link"],
    time: "Today, 10:42 AM",
  },
  {
    id: "S-4820",
    text: "Congratulations! You have won ₹25,000. Pay processing fee to claim your reward.",
    risk: 84,
    level: "High",
    category: "Fake reward",
    indicators: ["Unexpected reward", "Advance payment"],
    time: "Today, 9:18 AM",
  },
  {
    id: "S-4819",
    text: "Hi, I have sent the notes from class. See you tomorrow!",
    risk: 8,
    level: "Low",
    category: "No strong indicators",
    indicators: [],
    time: "Yesterday, 4:06 PM",
  },
  {
    id: "S-4818",
    text: "Your parcel is delayed. Update delivery details at bit.ly/track-now",
    risk: 66,
    level: "Medium",
    category: "Delivery phishing",
    indicators: ["Shortened URL", "Delivery pretext"],
    time: "Yesterday, 1:32 PM",
  },
];
const seedReports = [
  {
    id: "IR-1042",
    category: "Phishing",
    title: "Bank KYC verification message",
    status: "Under Review",
    date: "Oct 24, 2026",
    risk: "High",
  },
  {
    id: "IR-1041",
    category: "Fake reward",
    title: "Prize claim payment request",
    status: "Submitted",
    date: "Oct 23, 2026",
    risk: "High",
  },
  {
    id: "IR-1039",
    category: "Suspicious payment",
    title: "Unfamiliar UPI collect request",
    status: "Draft",
    date: "Oct 22, 2026",
    risk: "Medium",
  },
];
function getStore<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export default function App() {
  const [page, setPage] = useState<Page>(() =>
      new URLSearchParams(window.location.search).get("view") === "scroll-demo"
        ? "Scroll Animation Demo"
        : "Dashboard",
    ),
    [mobile, setMobile] = useState(false),
    [scans, setScans] = useState<Scan[]>(() => getStore("cs-scans", seed)),
    [vault, setVault] = useState<Scan[]>(() =>
      getStore("cs-vault", [seed[0], seed[1]]),
    ),
    [reports, setReports] = useState<any[]>(() =>
      getStore("cs-reports", seedReports),
    ),
    [query, setQuery] = useState(""),
    [msg, setMsg] = useState(""),
    [result, setResult] = useState<Scan | null>(null),
    [url, setUrl] = useState(""),
    [urlResult, setUrlResult] = useState<any>(null),
    [tab, setTab] = useState("All items"),
    [file, setFile] = useState<File | null>(null),
    [ocr, setOcr] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [emergency, setEmergency] = useState(""),
    [quiz, setQuiz] = useState<number | null>(null),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [showReport, setShowReport] = useState(false),
    [reportDraft, setReportDraft] = useState({
      category: "Phishing",
      description: "",
      evidence: "",
    });
  const persist = (key: string, v: any, fn: any) => {
    fn(v);
    localStorage.setItem(key, JSON.stringify(v));
  };
  const flash = (s: string) => {
    setNotice(s);
    setTimeout(() => setNotice(""), 3200);
  };
  const run = (text: string) => {
    if (!text.trim()) {
      flash("Add some message text before scanning.");
      return;
    }
    const r = analyze(text);
    setResult(r);
    if (getStore("cs-alerts", false) && r.risk >= getStore("cs-threshold", 60))
      flash("Demo alert: a scan crossed your risk threshold.");
    setScans((p) => {
      const n = [r, ...p];
      localStorage.setItem("cs-scans", JSON.stringify(n));
      return n;
    });
  };
  const save = (r: Scan) => {
    if (vault.some((x) => x.id === r.id)) {
      flash("This item is already in SafeVault.");
      return;
    }
    persist("cs-vault", [r, ...vault], setVault);
    flash("Saved a copy to SafeVault.");
  };
  const remove = (id: string) => {
    persist(
      "cs-vault",
      vault.filter((x) => x.id !== id),
      setVault,
    );
    flash("Saved copy deleted.");
  };
  const saveNote = (id: string, notes: string) =>
    persist(
      "cs-vault",
      vault.map((x) => (x.id === id ? { ...x, notes } : x)),
      setVault,
    );
  const createReport = (r?: Scan) => {
    if (!r) {
      setReportDraft({ category: "Phishing", description: "", evidence: "" });
      setShowReport(true);
      return;
    }
    const next = [
      {
        id: "IR-" + (1043 + reports.length),
        category: r.category,
        title: r.text.slice(0, 58),
        description: "",
        status: "Draft",
        date: new Date().toLocaleDateString(),
        risk: r.level,
        message: r.text,
      },
      ...reports,
    ];
    persist("cs-reports", next, setReports);
    flash("Incident report saved as a local draft.");
    setPage("Incident Reports");
  };
  const submitReport = () => {
    if (reportDraft.description.trim().length < 10) {
      flash("Please add at least 10 characters describing what happened.");
      return;
    }
    const next = [
      {
        id: "IR-" + (1043 + reports.length),
        category: reportDraft.category,
        title: reportDraft.description.slice(0, 58),
        description: reportDraft.description,
        evidence: reportDraft.evidence,
        status: "Draft",
        date: new Date().toLocaleDateString(),
        risk: "Uncertain",
      },
      ...reports,
    ];
    persist("cs-reports", next, setReports);
    setShowReport(false);
    flash("Incident report saved as a local draft.");
    setPage("Incident Reports");
  };
  const filteredVault = vault.filter(
    (v) =>
      (tab === "All items" || v.level === tab) &&
      `${v.text} ${v.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const scanDemoBatch = (items: Scan[]) => {
    const when = new Date().toLocaleString();
    const fresh = items.map((item, index) => ({
      ...item,
      id: `DM-${Date.now()}-${index}`,
      time: when,
    }));
    setScans((previous) => {
      const next = [...fresh, ...previous];
      localStorage.setItem("cs-scans", JSON.stringify(next));
      return next;
    });
    const flagged = items.filter((item) => item.risk >= 30).length;
    flash(
      `Demo inbox scanned: ${items.length} messages, ${flagged} flagged for review.`,
    );
  };
  const doUrl = () => {
    if (!url.trim()) {
      flash("Paste a URL to scan.");
      return;
    }
    let parsed: URL | null = null;
    try {
      parsed = new URL(url.includes("://") ? url : `https://${url}`);
    } catch {}
    const host = parsed?.hostname || "";
    const checks = [
      [
        "URL syntax",
        !!parsed,
        parsed
          ? "A URL could be parsed."
          : "This does not look like a valid URL.",
      ],
      [
        "IP address host",
        !!host && /^\d{1,3}(\.\d{1,3}){3}$/.test(host),
        /^\d/.test(host)
          ? "IP address hosts can hide the site identity."
          : "No IPv4 address host detected.",
      ],
      [
        "Shortened URL",
        /bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|cutt\.ly/i.test(host),
        /bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|cutt\.ly/i.test(host)
          ? "Short links hide the destination domain."
          : "No common shortener pattern detected.",
      ],
      [
        "Lookalike / misleading hostname",
        /(xn--|\d{2,}|-{2,}|secure|verify|login|account|bank)/i.test(host),
        /(xn--|\d{2,}|-{2,}|secure|verify|login|account|bank)/i.test(host)
          ? "Hostname contains a pattern that deserves a closer look."
          : "No basic lookalike pattern detected.",
      ],
      [
        "Encoded / obfuscated content",
        /%[0-9a-f]{2}|@|\\|%00/i.test(url),
        /%[0-9a-f]{2}|@|\\|%00/i.test(url)
          ? "Encoded characters or user-info syntax may obscure intent."
          : "No obvious encoding pattern detected.",
      ],
    ];
    const score = checks.slice(1).filter((x) => x[1]).length;
    setUrlResult({
      host,
      checks,
      level: !parsed
        ? "Uncertain"
        : score > 1
          ? "High"
          : score === 1
            ? "Medium"
            : "Low",
    });
  };
  const doOcr = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const T = await import("tesseract.js");
      const out = await T.recognize(file, "eng");
      setOcr(out.data.text);
      flash("Text extracted. Review it before scanning.");
    } catch {
      setOcr("");
      flash("OCR could not run. You can type or paste the visible text below.");
    } finally {
      setBusy(false);
    }
  };
  const data = [
    { day: "Mon", scans: 18 },
    { day: "Tue", scans: 26 },
    { day: "Wed", scans: 21 },
    { day: "Thu", scans: 34 },
    { day: "Fri", scans: 29 },
    { day: "Sat", scans: 40 },
    { day: "Sun", scans: 36 },
  ];
  const riskCounts = [
    { name: "High", value: scans.filter((s) => s.level === "High").length },
    { name: "Medium", value: scans.filter((s) => s.level === "Medium").length },
    { name: "Low", value: scans.filter((s) => s.level === "Low").length },
  ];
  const sidebar = (
    <>
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>
        <div>
          <b>
            CyberShield <span>AI</span>
          </b>
          <small>PERSONAL SECURITY</small>
        </div>
      </div>
      <div className="nav-wrap">
        {["WORKSPACE", "PROTECT", "LEARN", "INSIGHTS", "SYSTEM"].map((g) => (
          <section className="nav-group" key={g}>
            <p>{g}</p>
            {nav
              .filter((n) => n.group === g)
              .map((n) => (
                <button
                  key={n.label}
                  className={"nav-item " + (page === n.label ? "active" : "")}
                  onClick={() => {
                    setPage(n.label);
                    setMobile(false);
                  }}
                >
                  <n.icon size={17} />
                  <span>{n.label}</span>
                  {n.label === "Cyber Emergency" && <i />}
                </button>
              ))}
          </section>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="local-status">
          <span className="pulse" />
          <div>
            <b>All systems ready</b>
            <small>Local analysis active</small>
          </div>
        </div>
        <button
          className="profile"
          onClick={() => {
            window.location.assign("/");
          }}
          aria-label="Open sign-in demo"
        >
          <div className="avatar">KS</div>
          <div>
            <b>Kapil Sharma</b>
            <small>Sign-in demo</small>
          </div>
          <ChevronDown size={15} />
        </button>
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
        {sidebar}
      </aside>
      {mobile && (
        <button
          className="scrim"
          onClick={() => setMobile(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="crumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <b>{page}</b>
          </div>
          <div className="top-actions">
            <span className="live-badge">
              <span className="pulse" /> PROTECTION ACTIVE
            </span>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => flash("You are all caught up.")}
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-avatar">KS</div>
          </div>
        </header>
        <div className="content">
          {page === "Dashboard" && (
            <Dashboard
              scans={scans}
              vault={vault}
              reports={reports}
              data={data}
              risks={riskCounts}
              go={setPage}
              runQuick={setMsg}
            />
          )}
          {page === "Demo Message Inbox" && (
            <DemoInbox
              onScanBatch={scanDemoBatch}
              save={save}
              report={createReport}
              flash={flash}
            />
          )}
          {page === "Message Scanner" && (
            <>
              <PageHead
                eyebrow="DETECTION TOOLS"
                title="Message scanner"
                subtitle="Understand suspicious texts before you respond, click, or share."
              />
              <div className="two-col">
                <div className="panel scanner-panel">
                  <div className="panel-title">
                    <div className="title-icon cyan">
                      <MessageSquareText size={18} />
                    </div>
                    <div>
                      <b>Analyze a message</b>
                      <small>Paste the text as you received it</small>
                    </div>
                    <span className="local-pill">LOCAL ANALYSIS</span>
                  </div>
                  <label className="field-label" htmlFor="message">
                    Message content
                  </label>
                  <textarea
                    id="message"
                    className="message-input"
                    placeholder="Paste a suspicious SMS, email, or chat message here…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    maxLength={10000}
                  />
                  <div className="field-bottom">
                    <small>{msg.length} / 10,000 characters</small>
                    <button
                      className="text-button"
                      onClick={() =>
                        setMsg(
                          "Your SBI account will be suspended today. Verify your KYC immediately at http://sbi-kyc-alert.example.in or your services will be blocked.",
                        )
                      }
                    >
                      Try an example <ArrowUpRight size={13} />
                    </button>
                  </div>
                  <button className="primary wide" onClick={() => run(msg)}>
                    <Sparkles size={16} /> Analyze message
                  </button>
                  <div className="privacy-note">
                    <LockKeyhole size={14} /> Analysis runs in this browser.
                    Your message is not sent to an external AI service.
                  </div>
                </div>
                <div className="panel result-panel">
                  {result ? (
                    <AnalysisResult
                      r={result}
                      save={save}
                      report={createReport}
                    />
                  ) : (
                    <Empty
                      icon={ShieldCheck}
                      title="Your analysis will appear here"
                      text="We’ll explain the indicators we find and suggest practical next steps."
                    />
                  )}
                </div>
              </div>
              <Disclaimer />
            </>
          )}
          {page === "URL Scanner" && (
            <>
              <PageHead
                eyebrow="SAFE BROWSING"
                title="URL scanner"
                subtitle="Inspect a URL as text. We never open it or fetch its contents."
              />
              <div className="panel url-panel">
                <div className="panel-title">
                  <div className="title-icon violet">
                    <Link2 size={18} />
                  </div>
                  <div>
                    <b>Check a link safely</b>
                    <small>Paste the full URL or domain below</small>
                  </div>
                </div>
                <label className="field-label" htmlFor="url">
                  URL to inspect
                </label>
                <div className="url-entry">
                  <input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doUrl()}
                    placeholder="https://example.com/account"
                  />
                  <button className="primary" onClick={doUrl}>
                    <Search size={16} /> Scan URL
                  </button>
                </div>
                <div className="privacy-note">
                  <Shield size={14} /> No network request is made. Reputation
                  checks are unavailable in this local demo.
                </div>
              </div>
              {urlResult && (
                <div className="panel url-results">
                  <div className="result-heading">
                    <div>
                      <span
                        className={"risk-pill " + urlResult.level.toLowerCase()}
                      >
                        {urlResult.level} risk indicators
                      </span>
                      <h3>{urlResult.host || "Unrecognized address"}</h3>
                      <p>
                        Checks below are basic pattern checks, not a website
                        reputation verdict.
                      </p>
                    </div>
                    <div className="domain-icon">
                      <Globe2 />
                    </div>
                  </div>
                  <div className="check-list">
                    {urlResult.checks.map((c: any) => (
                      <div className="check-row" key={c[0]}>
                        <div className={"check-mark " + (c[1] ? "warn" : "ok")}>
                          {c[1] ? (
                            <AlertTriangle size={15} />
                          ) : (
                            <BadgeCheck size={15} />
                          )}
                        </div>
                        <div>
                          <b>{c[0]}</b>
                          <small>{c[2]}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Disclaimer />
                </div>
              )}
              <div className="notice-box">
                <CircleHelp size={16} />
                <span>
                  A clean result is not a guarantee that a website is safe.
                  Verify the domain through an official channel you find
                  independently.
                </span>
              </div>
            </>
          )}
          {page === "Screenshot Scanner" && (
            <>
              <PageHead
                eyebrow="IMAGE ANALYSIS"
                title="Screenshot scanner"
                subtitle="Extract text from a screenshot, review it, then scan it for suspicious indicators."
              />
              <div className="panel upload-panel">
                <div className="upload-zone">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (
                        f &&
                        (f.size > 8 * 1024 * 1024 ||
                          !/^image\/(png|jpeg|webp)$/.test(f.type))
                      ) {
                        flash("Choose a PNG, JPG, or WebP image under 8 MB.");
                        return;
                      }
                      setFile(f || null);
                      setOcr("");
                    }}
                  />
                  <div className="upload-art">
                    <Upload size={24} />
                  </div>
                  <b>{file ? file.name : "Drop a screenshot here or browse"}</b>
                  <small>PNG, JPG, or WebP · Maximum 8 MB</small>
                  {file && (
                    <button
                      className="text-button"
                      onClick={() => {
                        setFile(null);
                        setOcr("");
                      }}
                    >
                      <X size={14} /> Remove image
                    </button>
                  )}
                </div>
                {file && (
                  <div className="preview-wrap">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded screenshot preview"
                    />
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={doOcr}
                    >
                      {busy ? "Extracting text…" : "Extract text with OCR"}
                    </button>
                  </div>
                )}
                <label className="field-label" htmlFor="ocr">
                  Extracted text <span className="optional">· editable</span>
                </label>
                <textarea
                  id="ocr"
                  className="message-input"
                  placeholder="OCR text appears here. You can also type or paste text manually if OCR is unavailable."
                  value={ocr}
                  onChange={(e) => setOcr(e.target.value)}
                />
                <button className="primary" onClick={() => run(ocr)}>
                  <Sparkles size={16} /> Analyze extracted text
                </button>
              </div>
              {result && (
                <div className="panel result-panel">
                  <AnalysisResult
                    r={result}
                    save={save}
                    report={createReport}
                  />
                </div>
              )}
            </>
          )}
          {page === "SafeVault" && (
            <>
              <PageHead
                eyebrow="PRIVATE STORAGE"
                title="SafeVault"
                subtitle="Keep a copy of suspicious content and review it without opening its links."
                action={
                  <button
                    className="secondary"
                    onClick={() => setPage("Message Scanner")}
                  >
                    <Plus size={15} /> Add a saved item
                  </button>
                }
              />
              <div className="notice-box">
                <LockKeyhole size={16} />
                <span>
                  SafeVault stores copies in this browser on this device. Saving
                  a copy does not move or delete the original message in another
                  app.
                </span>
              </div>
              <div className="vault-toolbar">
                <div className="searchbox">
                  <Search size={15} />
                  <input
                    placeholder="Search saved items…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="filter-tabs">
                  {["All items", "High", "Medium", "Low"].map((t) => (
                    <button
                      className={tab === t ? "selected" : ""}
                      key={t}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <span className="item-count">{filteredVault.length} items</span>
              </div>
              <div className="vault-list">
                {filteredVault.length ? (
                  filteredVault.map((v) => (
                    <VaultItem
                      key={v.id}
                      item={v}
                      remove={remove}
                      report={createReport}
                      saveNote={saveNote}
                    />
                  ))
                ) : (
                  <Empty
                    icon={Inbox}
                    title="Your SafeVault is clear"
                    text="Save an analysis to keep a private copy for later review."
                  />
                )}
              </div>
            </>
          )}
          {page === "Cyber Emergency" && (
            <>
              <PageHead
                eyebrow="IMMEDIATE GUIDANCE"
                title="Cyber emergency"
                subtitle="Choose what happened for a short, practical response checklist."
              />
              <div className="emergency-banner">
                <div className="emergency-symbol">
                  <LifeBuoy size={21} />
                </div>
                <div>
                  <b>
                    If money is at risk, contact your bank or payment provider
                    now.
                  </b>
                  <small>
                    For cyber financial fraud in India, call 1930 promptly and
                    file a report at cybercrime.gov.in.
                  </small>
                </div>
                <a
                  href="https://cybercrime.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="secondary"
                >
                  Official portal <ExternalLink size={13} />
                </a>
              </div>
              <div className="emergency-grid">
                {[
                  [
                    "Opened a suspicious link",
                    "Close the page. Don’t download files or grant permissions. Run a security scan and watch for unusual account activity.",
                  ],
                  [
                    "Entered a password",
                    "Change it immediately from the official app/site, starting with your email. Change reused passwords and enable MFA.",
                  ],
                  [
                    "Shared an OTP or PIN",
                    "Contact the relevant bank or service using its official number. Ask them to secure access and block unauthorized transactions.",
                  ],
                  [
                    "Transferred money",
                    "Call your bank/payment provider immediately to report the transaction. In India, call 1930 promptly and report at cybercrime.gov.in.",
                  ],
                  [
                    "Lost account access",
                    "Use the service’s official recovery flow from a trusted device. Secure your email and revoke unfamiliar sessions.",
                  ],
                  [
                    "Shared sensitive information",
                    "Contact the organization involved using a verified channel. Monitor accounts and consider what credentials or documents need replacement.",
                  ],
                ].map(([title, body]) => (
                  <button
                    key={title}
                    className={
                      "emergency-card " + (emergency === title ? "chosen" : "")
                    }
                    onClick={() => setEmergency(title)}
                  >
                    <span className="emergency-card-icon">
                      <AlertTriangle size={17} />
                    </span>
                    <b>{title}</b>
                    <small>{body}</small>
                    <span className="check-action">
                      {emergency === title
                        ? "Selected for your checklist"
                        : "View action checklist"}{" "}
                      <ChevronRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
              {emergency && (
                <div className="panel checklist">
                  <div className="panel-title">
                    <div className="title-icon amber">
                      <BadgeCheck size={18} />
                    </div>
                    <div>
                      <b>Your first steps</b>
                      <small>
                        {emergency} · Progress is kept for this visit only
                      </small>
                    </div>
                  </div>
                  {(emergency === "Transferred money"
                    ? [
                        "Call your bank/payment provider using the number in its official app.",
                        "Ask the provider to flag the transaction and secure your account.",
                        "If in India, call 1930 promptly and file a report on cybercrime.gov.in.",
                        "Save transaction references and relevant messages as evidence.",
                      ]
                    : emergency === "Entered a password"
                      ? [
                          "Change the exposed password using the official service.",
                          "Change any other account that reused that password.",
                          "Enable multi-factor authentication and sign out other sessions.",
                          "Check account recovery details for unauthorized changes.",
                        ]
                      : [
                          "Stop interacting with the sender/site and do not share more information.",
                          "Secure the related account from a trusted device.",
                          "Preserve the message, URL, and timestamps in SafeVault.",
                          "Contact the affected institution through an independently verified channel.",
                        ]
                  ).map((s, i) => (
                    <label className="task-check" key={s}>
                      <input type="checkbox" />
                      <span>{s}</span>
                      <small>{i + 1}</small>
                    </label>
                  ))}
                </div>
              )}
              <p className="subtle-center">
                CyberShield AI cannot recover money or reverse transactions.
                Contact official providers directly.
              </p>
            </>
          )}
          {page === "Incident Reports" && (
            <>
              <PageHead
                eyebrow="CASE MANAGEMENT"
                title="Incident reports"
                subtitle="Record suspected incidents and keep your own review notes."
                action={
                  <button className="primary" onClick={() => createReport()}>
                    <Plus size={15} /> New report
                  </button>
                }
              />
              <div className="stat-row compact">
                <MiniStat
                  label="Total reports"
                  value={reports.length.toString()}
                  icon={FileText}
                />
                <MiniStat
                  label="Open reports"
                  value={reports
                    .filter((r: any) => r.status !== "Reviewed")
                    .length.toString()}
                  icon={Clock3}
                />
                <MiniStat
                  label="High risk"
                  value={reports
                    .filter((r: any) => r.risk === "High")
                    .length.toString()}
                  icon={ShieldAlert}
                />
              </div>
              <ReportsTable
                reports={reports}
                update={(id: string, status: string) =>
                  persist(
                    "cs-reports",
                    reports.map((r: any) =>
                      r.id === id ? { ...r, status } : r,
                    ),
                    setReports,
                  )
                }
              />
              <div className="notice-box">
                <CircleHelp size={16} />
                <span>
                  Statuses are local to this prototype. They are not updates
                  from a government agency, bank, or service provider.
                </span>
              </div>
            </>
          )}
          {page === "AI Assistant" && <Assistant flash={flash} />}
          {page === "Learning Centre" && (
            <Learning quiz={quiz} setQuiz={setQuiz} flash={flash} />
          )}
          {page === "Scroll Animation Demo" && (
            <div className="scroll-demo-page">
              <PageHead
                eyebrow="INTERACTIVE COMPONENT PREVIEW"
                title="Scroll animation"
                subtitle="A scroll-linked 3D card, adapted for the CyberShield design system."
              />
              <HeroScrollDemo />
            </div>
          )}
          {page === "Scam Pattern Radar" && (
            <Radar scans={scans} reports={reports} />
          )}
          {page === "Admin Analytics" && (
            <Admin
              scans={scans}
              reports={reports}
              risks={riskCounts}
              data={data}
            />
          )}
          {page === "Settings & Privacy" && <SettingsPage flash={flash} />}
        </div>
        <footer className="app-footer">
          <span>
            <ShieldCheck size={13} /> CyberShield AI{" "}
            <span className="dot">·</span> Personal security workspace
          </span>
          <span>Automated assessments are guidance, not a guarantee.</span>
        </footer>
      </main>
      {showReport && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowReport(false)}
        >
          <div
            className="report-modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <div className="eyebrow">LOCAL INCIDENT RECORD</div>
                <h2 id="report-title">Create an incident report</h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close dialog"
                onClick={() => setShowReport(false)}
              >
                <X size={17} />
              </button>
            </div>
            <p className="modal-help">
              Keep a concise record. Avoid adding passwords, OTPs, PINs, or
              unnecessary personal information.
            </p>
            <label className="field-label" htmlFor="report-category">
              Incident category
            </label>
            <select
              id="report-category"
              value={reportDraft.category}
              onChange={(e) =>
                setReportDraft({ ...reportDraft, category: e.target.value })
              }
            >
              <option>Phishing</option>
              <option>Financial scam</option>
              <option>OTP theft</option>
              <option>Impersonation</option>
              <option>Suspicious payment</option>
              <option>Other</option>
            </select>
            <label className="field-label" htmlFor="report-description">
              What happened?
            </label>
            <textarea
              id="report-description"
              className="modal-textarea"
              maxLength={3000}
              value={reportDraft.description}
              onChange={(e) =>
                setReportDraft({ ...reportDraft, description: e.target.value })
              }
              placeholder="Describe what you received or what action you took…"
            />
            <label className="field-label" htmlFor="report-evidence">
              Related message or URL text{" "}
              <span className="optional">· optional</span>
            </label>
            <textarea
              id="report-evidence"
              className="modal-textarea short"
              maxLength={5000}
              value={reportDraft.evidence}
              onChange={(e) =>
                setReportDraft({ ...reportDraft, evidence: e.target.value })
              }
              placeholder="Paste plain text only. Links will not be opened."
            />
            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setShowReport(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={submitReport}>
                <FileText size={15} /> Save draft
              </button>
            </div>
            <small className="modal-help">
              Draft status applies only within this prototype.
            </small>
          </div>
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <BadgeCheck size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}

function PageHead({ eyebrow, title, subtitle, action }: any) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
function Dashboard({ scans, vault, reports, data, risks, go, runQuick }: any) {
  const [show, setShow] = useState(false);
  return (
    <>
      <PageHead
        eyebrow="SATURDAY, OCTOBER 24, 2026"
        title="Good afternoon, Kapil"
        subtitle="Your personal security overview is ready."
        action={
          <button className="secondary" onClick={() => setShow(!show)}>
            <Clock3 size={15} /> Last 7 days <ChevronDown size={14} />
          </button>
        }
      />
      <div className="stat-row">
        <StatCard
          title="Total scans"
          value={scans.length.toLocaleString()}
          trend="12%"
          desc="vs. previous period"
          icon={Search}
          tone="blue"
        />
        <StatCard
          title="Suspicious detected"
          value={scans.filter((s: Scan) => s.risk >= 30).length.toString()}
          trend="3 new"
          desc="need your attention"
          icon={ShieldAlert}
          tone="red"
        />
        <StatCard
          title="Saved in SafeVault"
          value={vault.length.toString().padStart(2, "0")}
          trend="Protected"
          desc="copies on this device"
          icon={Inbox}
          tone="violet"
        />
        <StatCard
          title="Open reports"
          value={reports
            .filter((r: any) => r.status !== "Reviewed")
            .length.toString()
            .padStart(2, "0")}
          trend="In progress"
          desc="local prototype status"
          icon={FileText}
          tone="amber"
        />
      </div>
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Scanning activity</h3>
              <p>Items analyzed over the last 7 days</p>
            </div>
            <span className="chart-label">
              <i /> Scans
            </span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#42c5e8" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#42c5e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2b3a" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7f8da0", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7f8da0", fontSize: 11 }}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111d2c",
                    border: "1px solid #26364a",
                    borderRadius: 10,
                    color: "#edf4fc",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#4bc9e9"
                  strokeWidth={2}
                  fill="url(#fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <h3>Risk distribution</h3>
              <p>Based on local scan history</p>
            </div>
            <span className="mini-info" title="Illustrative local data">
              i
            </span>
          </div>
          <div className="risk-bars">
            {risks.map((r: any) => (
              <div className="risk-line" key={r.name}>
                <div>
                  <span className={"risk-dot " + r.name.toLowerCase()} />
                  {r.name}
                  <b>{r.value}</b>
                </div>
                <div className="bar-track">
                  <i
                    className={r.name.toLowerCase()}
                    style={{
                      width: `${Math.max(5, (r.value / Math.max(1, scans.length)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="risk-foot">
            <span>Example/demo data</span>
            <span>Local only</span>
          </div>
        </div>
      </div>
      <div className="bottom-grid">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Your latest message analyses</p>
            </div>
            <button
              className="text-button"
              onClick={() => go("Message Scanner")}
            >
              New scan <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="activity-list">
            {scans.slice(0, 4).map((s: Scan) => (
              <div className="activity-row" key={s.id}>
                <div className={"activity-icon " + s.level.toLowerCase()}>
                  {s.level === "Low" ? (
                    <MessageSquareText size={15} />
                  ) : (
                    <ShieldAlert size={15} />
                  )}
                </div>
                <div className="activity-copy">
                  <b>{s.category}</b>
                  <small>{s.text}</small>
                </div>
                <span className={"risk-pill " + s.level.toLowerCase()}>
                  {s.level}
                </span>
                <time>{s.time}</time>
              </div>
            ))}
          </div>
        </div>
        <div className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Take the next step</p>
            </div>
          </div>
          <button
            className="quick-action"
            onClick={() => go("Message Scanner")}
          >
            <span className="quick-icon cyan">
              <MessageSquareText size={16} />
            </span>
            <span>
              <b>Scan a message</b>
              <small>Check for scam indicators</small>
            </span>
            <ChevronRight size={16} />
          </button>
          <button className="quick-action" onClick={() => go("URL Scanner")}>
            <span className="quick-icon violet">
              <Globe2 size={16} />
            </span>
            <span>
              <b>Check a URL</b>
              <small>Inspect a link safely</small>
            </span>
            <ChevronRight size={16} />
          </button>
          <button
            className="quick-action"
            onClick={() => go("Cyber Emergency")}
          >
            <span className="quick-icon amber">
              <LifeBuoy size={16} />
            </span>
            <span>
              <b>Get emergency help</b>
              <small>Guided response steps</small>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="example-footnote">
        <span className="pulse" /> Local demo · no live threat intelligence
        connected
      </div>
    </>
  );
}
function StatCard({ title, value, trend, desc, icon: Icon, tone }: any) {
  return (
    <div className="stat-card">
      <div className={"stat-icon " + tone}>
        <Icon size={18} />
      </div>
      <span className="stat-trend">{trend}</span>
      <small>{title}</small>
      <strong>{value}</strong>
      <span className="stat-desc">{desc}</span>
    </div>
  );
}
function MiniStat({ label, value, icon: Icon }: any) {
  return (
    <div className="mini-stat">
      <span>
        <Icon size={16} />
      </span>
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}
function Empty({ icon: Icon, title, text }: any) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={22} />
      </div>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}
function AnalysisResult({ r, save, report }: any) {
  return (
    <>
      <div className="result-top">
        <div className={"score-ring " + r.level.toLowerCase()}>
          <b>{r.risk}</b>
          <small>of 100</small>
        </div>
        <div>
          <span className={"risk-pill " + r.level.toLowerCase()}>
            {r.level} risk
          </span>
          <h3>{r.category}</h3>
          <p>
            Risk score is a rule-based indicator, not a probability of fraud.
          </p>
        </div>
      </div>
      <div className="explanation">
        <h4>
          <Sparkles size={15} /> What we noticed
        </h4>
        {r.indicators.length ? (
          r.indicators.map((x: string) => (
            <div className="indicator" key={x}>
              <AlertTriangle size={14} />
              <span>
                <b>{x}</b>
                <small>
                  {reason(x)} This is a signal to verify independently, not
                  proof of fraud.
                </small>
              </span>
            </div>
          ))
        ) : (
          <div className="indicator benign">
            <BadgeCheck size={14} />
            <span>
              <b>No strong indicators found</b>
              <small>
                This message may still be unsafe. Use a known official channel
                if unsure.
              </small>
            </span>
          </div>
        )}
      </div>
      <div className="next-steps">
        <b>Recommended next steps</b>
        <p>
          Don’t click links or share credentials in response. Verify the request
          using contact details from an official app or website you navigate to
          yourself.
        </p>
      </div>
      <div className="result-actions">
        <button className="secondary" onClick={() => save(r)}>
          <Inbox size={15} /> Save to SafeVault
        </button>
        <button className="text-button" onClick={() => report(r)}>
          <FileText size={15} /> Create report
        </button>
      </div>
    </>
  );
}
function reason(x: string) {
  return (
    (
      {
        "Urgency / threat":
          "Pressure to act quickly can make it harder to verify a request.",
        "Credential or OTP request":
          "Legitimate support should not ask you to share an OTP or password.",
        "Money or payment request":
          "Unexpected payment requests deserve independent verification.",
        "Reward or lottery claim":
          "Unexpected prizes often use fees or personal data as a lure.",
        "KYC / account verification":
          "Scammers may impersonate institutions to collect personal details.",
        "Suspicious link":
          "A message link can lead to a lookalike sign-in page.",
        "Impersonation language":
          "Mentioning a trusted organization does not verify the sender.",
        "Manipulative secrecy":
          "Requests for secrecy can discourage independent checks.",
      } as any
    )[x] || "This pattern may be used to influence a recipient."
  );
}
function Disclaimer() {
  return (
    <div className="disclaimer">
      <Shield size={14} />
      <span>
        Automated assessments are guidance, not a guarantee that content is safe
        or fraudulent.
      </span>
    </div>
  );
}
const demoInboxMessages = [
  {
    id: "demo-1",
    sender: "SBI Account Alerts",
    time: "10:42 AM",
    text: "Your account will be suspended today. Complete KYC immediately at https://sbi-kyc.example.com to keep your services active.",
  },
  {
    id: "demo-2",
    sender: "Unknown number",
    time: "10:18 AM",
    text: "Congratulations! You have won ₹25,000. Pay a processing fee to claim your reward.",
  },
  {
    id: "demo-3",
    sender: "Bank Support",
    time: "Yesterday",
    text: "Your bank support team needs your OTP now to stop an account block. Do not tell anyone else.",
  },
  {
    id: "demo-4",
    sender: "Parcel Update",
    time: "Yesterday",
    text: "Your parcel is delayed. Verify your delivery details immediately: https://bit.ly/parcel-check",
  },
  {
    id: "demo-5",
    sender: "Aarav",
    time: "Yesterday",
    text: "Hey, I sent the notes from class. See you tomorrow!",
  },
  {
    id: "demo-6",
    sender: "Library",
    time: "Monday",
    text: "Reminder: the books you borrowed are due next week. Reply if you need an extension.",
  },
];
function DemoInbox({ onScanBatch, save, report, flash }: any) {
  const messages = useMemo(
    () =>
      demoInboxMessages.map((m) => ({
        ...analyze(m.text),
        id: m.id,
        time: m.time,
        sender: m.sender,
      })),
    [],
  );
  const [filter, setFilter] = useState("Flagged");
  const [selected, setSelected] = useState("demo-1");
  const [term, setTerm] = useState("");
  const flagged = messages.filter((m) => m.risk >= 30);
  const visible = messages.filter(
    (m) =>
      (filter === "All messages" ||
        (filter === "Flagged" ? m.risk >= 30 : m.risk < 30)) &&
      `${m.sender} ${m.text}`.toLowerCase().includes(term.toLowerCase()),
  );
  const active = visible.find((m) => m.id === selected) || visible[0];
  const speak = (message?: any, summaryOnly = false) => {
    if (!("speechSynthesis" in window)) {
      flash(
        "Voice is not supported in this browser. The risk summary is shown on screen.",
      );
      return false;
    }
    const language = getStore("cs-voice", "Hindi");
    let text: string;
    if (summaryOnly) {
      text =
        language === "Hindi"
          ? `डेमो इनबॉक्स स्कैन पूरा हुआ। ${messages.length} संदेश जाँचे गए। ${flagged.length} संदेशों में जोखिम संकेत मिले।`
          : `Demo inbox scan complete. ${messages.length} messages checked. ${flagged.length} messages have risk indicators.`;
    } else {
      text =
        language === "Hindi"
          ? `इस डेमो संदेश में ${message.level === "High" ? "ऊँचे" : message.level === "Medium" ? "मध्यम" : "कम"} जोखिम के संकेत हैं। संभावित श्रेणी: ${message.category}। जोखिम अंक ${message.risk}। लिंक न खोलें और अनुरोध को आधिकारिक माध्यम से जाँचें।`
          : `This demo message has ${message.level.toLowerCase()} risk indicators. Possible category: ${message.category}. Risk score ${message.risk}. Do not open links; verify through an official channel.`;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "Hindi" ? "hi-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  };
  const scanAll = () => {
    onScanBatch(messages);
    if (!speak(undefined, true))
      flash(
        `Scanned ${messages.length} demo messages; ${flagged.length} flagged. Voice is unavailable here, so read the summaries on screen.`,
      );
  };
  return (
    <>
      <PageHead
        eyebrow="BUILT-IN SAMPLE INBOX"
        title="Demo message inbox"
        subtitle="See sample texts in one place and sort possible scam messages from ordinary messages."
        action={
          <button className="primary" onClick={scanAll}>
            <ShieldCheck size={15} /> Scan all demo messages
          </button>
        }
      />
      <div className="notice-box demo-inbox-note">
        <Inbox size={16} />
        <span>
          <b>Demo mode:</b> these are built-in example messages saved only in
          this app. CyberShield cannot read SMS, WhatsApp, or another messenger
          on your device.
        </span>
      </div>
      <div className="inbox-toolbar">
        <div className="searchbox">
          <Search size={15} />
          <input
            placeholder="Search demo messages…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {["Flagged", "Looks okay", "All messages"].map((label) => (
            <button
              className={filter === label ? "selected" : ""}
              key={label}
              onClick={() => setFilter(label)}
            >
              {label}
              {label === "Flagged" && <b>{flagged.length}</b>}
            </button>
          ))}
        </div>
        <button
          className="secondary voice-control"
          onClick={() => (active ? speak(active) : speak(undefined, true))}
        >
          <Volume2 size={15} /> Speak summary
        </button>
      </div>
      <div className="voice-support-note">
        <Volume2 size={14} />
        <span>
          This in-app browser does not provide voice playback. The scan summary
          and each message’s guidance are shown as text below.
        </span>
      </div>
      <div className="inbox-layout">
        <div className="panel inbox-list">
          {visible.length ? (
            visible.map((m) => (
              <button
                key={m.id}
                className={"inbox-row " + (active?.id === m.id ? "chosen" : "")}
                onClick={() => setSelected(m.id)}
              >
                <span
                  className={"inbox-avatar " + (m.risk >= 30 ? "warn" : "safe")}
                >
                  {m.risk >= 30 ? (
                    <AlertTriangle size={15} />
                  ) : (
                    <MessageSquareText size={15} />
                  )}
                </span>
                <span className="inbox-row-copy">
                  <span>
                    <b>{m.sender}</b>
                    <time>{m.time}</time>
                  </span>
                  <small>{m.text}</small>
                  <span className="inbox-row-bottom">
                    <em className={"risk-pill " + m.level.toLowerCase()}>
                      {m.risk >= 30
                        ? "Needs review"
                        : m.level === "Low"
                          ? "Looks okay"
                          : m.level}
                    </em>
                    <span>{m.category}</span>
                  </span>
                </span>
              </button>
            ))
          ) : (
            <Empty
              icon={Inbox}
              title="No matching messages"
              text="Try another search or choose a different inbox filter."
            />
          )}
        </div>
        <div className="panel inbox-detail">
          {active ? (
            <>
              <div className="message-detail-head">
                <div
                  className={
                    "inbox-avatar large " +
                    (active.risk >= 30 ? "warn" : "safe")
                  }
                >
                  {active.risk >= 30 ? (
                    <AlertTriangle size={18} />
                  ) : (
                    <MessageSquareText size={18} />
                  )}
                </div>
                <div>
                  <b>{active.sender}</b>
                  <small>Demo inbox · {active.time}</small>
                </div>
                <span className={"risk-pill " + active.level.toLowerCase()}>
                  {active.risk >= 30 ? "Needs review" : active.level}
                </span>
              </div>
              <div className="message-bubble">
                <small>MESSAGE TEXT · PLAIN TEXT ONLY</small>
                <p>{active.text}</p>
              </div>
              <AnalysisResult r={active} save={save} report={report} />
              <button
                className="secondary speak-detail"
                onClick={() => speak(active)}
              >
                <Volume2 size={15} /> सुनें / Hear risk summary
              </button>
            </>
          ) : (
            <Empty
              icon={MessageSquareText}
              title="Select a message"
              text="Choose a sample message to see its risk explanation."
            />
          )}
        </div>
      </div>
      <p className="subtle-center">
        “Needs review” means the rules found indicators. It does not prove the
        sender is fraudulent.
      </p>
    </>
  );
}
function VaultItem({ item, remove, report, saveNote }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="vault-item">
      <div className={"vault-state " + item.level.toLowerCase()}>
        <ShieldAlert size={17} />
      </div>
      <div className="vault-main">
        <div className="vault-head">
          <span className={"risk-pill " + item.level.toLowerCase()}>
            {item.level}
          </span>
          <span className="category-label">{item.category}</span>
          <time>{item.time}</time>
        </div>
        <p>{item.text}</p>
        <div className="vault-meta">
          {item.indicators?.slice(0, 3).map((i: string) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        {open && (
          <div className="vault-detail">
            <small>
              Saved as a copy on this device. Associated URL text is shown as
              plain text only.
            </small>
            <label>
              Review notes
              <textarea
                placeholder="Add a note for yourself…"
                onBlur={(e) => saveNote(item.id, e.target.value)}
                defaultValue={item.notes}
              />
            </label>
          </div>
        )}
      </div>
      <div className="vault-actions">
        <button className="text-button" onClick={() => setOpen(!open)}>
          {open ? "Hide details" : "Review"} <ChevronDown size={13} />
        </button>
        <button
          className="icon-button danger-button"
          aria-label="Delete saved item"
          onClick={() => remove(item.id)}
        >
          <Trash2 size={16} />
        </button>
        <button
          className="icon-button"
          aria-label="Create incident report"
          onClick={() => report(item)}
        >
          <FileText size={16} />
        </button>
      </div>
    </div>
  );
}
function ReportsTable({ reports, update }: any) {
  const [term, setTerm] = useState(""),
    [status, setStatus] = useState("All statuses");
  const visible = reports.filter(
    (r: any) =>
      (status === "All statuses" || r.status === status) &&
      `${r.id} ${r.title} ${r.category}`
        .toLowerCase()
        .includes(term.toLowerCase()),
  );
  return (
    <div className="panel table-panel">
      <div className="table-top">
        <div className="searchbox">
          <Search size={15} />
          <input
            placeholder="Search reports…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter incident reports by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All statuses</option>
          <option>Draft</option>
          <option>Submitted</option>
          <option>Under Review</option>
          <option>Reviewed</option>
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>REPORT</th>
              <th>CATEGORY</th>
              <th>DATE</th>
              <th>RISK</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r: any) => (
              <tr key={r.id}>
                <td>
                  <b>{r.id}</b>
                  <small>{r.title}</small>
                </td>
                <td>{r.category}</td>
                <td>{r.date}</td>
                <td>
                  <span className={"risk-pill " + r.risk.toLowerCase()}>
                    {r.risk}
                  </span>
                </td>
                <td>
                  <select
                    aria-label={`Update status for ${r.id}`}
                    value={r.status}
                    onChange={(e) => update(r.id, e.target.value)}
                  >
                    <option>Draft</option>
                    <option>Submitted</option>
                    <option>Under Review</option>
                    <option>Reviewed</option>
                  </select>
                </td>
                <td>
                  <button className="icon-button" title="Report detail">
                    <HelpCircle size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <Empty
            icon={FileText}
            title="No matching reports"
            text="Change the search term or status filter, or create a new report."
          />
        )}
      </div>
    </div>
  );
}
function Assistant({ flash }: any) {
  const [input, setInput] = useState(""),
    [messages, setMessages] = useState<any[]>([
      {
        who: "assistant",
        text: "Hi Kapil. I can help you understand scam warning signs and choose safe next steps. Please don’t share passwords, OTPs, PINs, or full payment details here.",
      },
    ]);
  const ask = (q = input) => {
    if (!q.trim()) return;
    if (/\b(otp|password|pin)\s*[:=]/i.test(q)) {
      flash("Please remove credentials before sharing.");
      return;
    }
    setMessages((m) => [
      ...m,
      { who: "user", text: q },
      { who: "assistant", text: answer(q) },
    ]);
    setInput("");
  };
  return (
    <>
      <PageHead
        eyebrow="PERSONAL GUIDANCE"
        title="AI cybersecurity assistant"
        subtitle="Practical, privacy-first guidance for safer decisions."
      />
      <div className="assistant-shell panel">
        <div className="assistant-header">
          <div className="assistant-avatar">
            <Bot size={20} />
          </div>
          <div>
            <b>CyberShield guide</b>
            <small>
              <span className="pulse" /> Local guidance active
            </small>
          </div>
          <span className="local-pill">PRIVATE BY DESIGN</span>
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div className={"chat-message " + m.who} key={i}>
              <div className="chat-avatar">
                {m.who === "assistant" ? <Shield size={15} /> : <span>KS</span>}
              </div>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="suggestions">
          {[
            "I shared an OTP",
            "How do I check a link?",
            "Verify a bank message",
          ].map((q) => (
            <button onClick={() => ask(q)} key={q}>
              {q}
            </button>
          ))}
        </div>
        <div className="chat-compose">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Ask a cybersecurity question…"
          />
          <button className="primary" onClick={() => ask()}>
            <ArrowUpRight size={17} />
          </button>
        </div>
        <small className="chat-disclaimer">
          Local guidance demo · Do not enter passwords, OTPs, PINs, or recovery
          codes.
        </small>
      </div>
    </>
  );
}
function answer(q: string) {
  if (/otp|password|credential/i.test(q))
    return "Act quickly from the official app or website: change the exposed password, revoke unfamiliar sessions, and contact your bank or service provider if an OTP or payment credential was shared. Never tell anyone an OTP. In India, report financial cyber fraud promptly at 1930 and cybercrime.gov.in.";
  if (/link|url|website/i.test(q))
    return "Keep the link unopened. Check its spelling and domain carefully; our URL scanner checks basic text patterns without visiting it. For sensitive requests, navigate to the official service yourself or use its official app. A clean pattern scan cannot guarantee safety.";
  if (/bank|verify|organisation|organization/i.test(q))
    return "Find the organization’s phone number or website independently from a bank card, official app, or known paperwork. Don’t rely on contact details in the suspicious message, and don’t share OTPs or passwords with callers.";
  if (/report|fraud|money/i.test(q))
    return "If money may be at risk, contact your bank or payment provider promptly using a verified channel. In India, call the cybercrime helpline 1930 promptly and submit a report at cybercrime.gov.in. Preserve relevant messages and transaction references.";
  return "Pause before responding. Look for urgency, requests for credentials or money, unexpected rewards, impersonation, and links. Verify using a contact channel you find independently. These are practical signals, not proof of fraud.";
}
function Learning({ quiz, setQuiz, flash }: any) {
  const questions = [
    {
      q: "A caller says they need your OTP to stop a bank account block. What should you do?",
      opts: [
        "Share it if they know your name",
        "Never share it; contact the bank through its official app or number",
        "Ask them to send a link instead",
      ],
      correct: 1,
      why: "Banks and legitimate support should never ask you to disclose an OTP. End the call and verify independently.",
    },
    {
      q: "A message says you won a prize but must pay a processing fee first.",
      opts: [
        "Pay quickly before it expires",
        "Share only your email",
        "Treat it as suspicious and verify independently",
      ],
      correct: 2,
      why: "Unexpected prizes coupled with advance fees are a common scam pattern.",
    },
    {
      q: "What is the safest way to check a bank link in a text?",
      opts: [
        "Tap it and inspect the page",
        "Open the bank app or type the known address yourself",
        "Forward it to a friend",
      ],
      correct: 1,
      why: "Navigate to the bank through a known channel instead of following an unsolicited link.",
    },
  ];
  const [choice, setChoice] = useState<number | null>(null),
    [done, setDone] = useState<number[]>(() => getStore("cs-lessons", []));
  const q = questions[quiz ?? 0];
  return (
    <>
      <PageHead
        eyebrow="BUILD YOUR SCAM SENSE"
        title="Learning centre"
        subtitle="Short lessons that help you recognize manipulation before you react."
      />
      <div className="learning-grid">
        <div className="lesson-list panel">
          <div className="panel-heading">
            <div>
              <h3>Your learning path</h3>
              <p>{done.length} of 3 lessons completed</p>
            </div>
            <span className="progress-circle">
              {Math.round((done.length / 3) * 100)}%
            </span>
          </div>
          {[
            ["01", "Spot the pressure", "Urgency, fear, secrecy"],
            ["02", "Protect credentials", "OTP, passwords, recovery codes"],
            ["03", "Check links safely", "Domains, shorteners, verification"],
          ].map(([n, t, d], i) => (
            <button
              key={n}
              className={"lesson-row " + ((quiz ?? 0) === i ? "current" : "")}
              onClick={() => {
                setQuiz(i);
                setChoice(null);
              }}
            >
              <span className="lesson-num">
                {done.includes(i) ? <BadgeCheck size={16} /> : n}
              </span>
              <span>
                <b>{t}</b>
                <small>{d}</small>
              </span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
        <div className="lesson-content panel">
          <div className="eyebrow">
            INTERACTIVE CHECK · LESSON {(quiz ?? 0) + 1}
          </div>
          <h2>{q.q}</h2>
          <div className="quiz-options">
            {q.opts.map((o: string, i: number) => (
              <button
                className={
                  "quiz-option " +
                  (choice === i ? "picked" : "") +
                  (choice !== null && i === q.correct ? " correct" : "")
                }
                key={o}
                onClick={() => setChoice(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {o}
                {choice !== null && i === q.correct && <BadgeCheck size={16} />}
              </button>
            ))}
          </div>
          {choice !== null && (
            <div
              className={
                "quiz-feedback " + (choice === q.correct ? "good" : "bad")
              }
            >
              <b>{choice === q.correct ? "That’s right." : "Not quite."}</b>
              <p>{q.why}</p>
              <button
                className="text-button"
                onClick={() => {
                  const n = [...new Set([...done, quiz ?? 0])];
                  setDone(n);
                  localStorage.setItem("cs-lessons", JSON.stringify(n));
                  setQuiz(((quiz ?? 0) + 1) % 3);
                  setChoice(null);
                  flash("Lesson progress saved on this device.");
                }}
              >
                Continue <ArrowUpRight size={13} />
              </button>
            </div>
          )}
          <div className="lesson-tip">
            <LockKeyhole size={15} /> No legitimate service should ask you to
            read out an OTP, PIN, or password.
          </div>
        </div>
      </div>
      <div className="article-cards">
        <Article
          title="The anatomy of a phishing text"
          tag="5 MIN READ"
          text="Learn to spot urgency, unexpected links, and requests to verify account details."
          icon={MessageSquareText}
        />
        <Article
          title="OTP safety in everyday life"
          tag="3 MIN READ"
          text="Why one-time codes should stay private, even when a caller sounds official."
          icon={LockKeyhole}
        />
        <Article
          title="Pause, verify, report"
          tag="4 MIN READ"
          text="A simple routine for checking requests before you take action."
          icon={ShieldCheck}
        />
      </div>
    </>
  );
}
function Article({ title, tag, text, icon: Icon }: any) {
  return (
    <div className="article-card">
      <span className="article-icon">
        <Icon size={17} />
      </span>
      <div>
        <small>{tag}</small>
        <b>{title}</b>
        <p>{text}</p>
        <button className="text-button">
          Read lesson <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}
function Radar({ scans, reports }: any) {
  const patterns = useMemo(() => {
    const all = [
      ...scans,
      ...reports.map((r: any) => ({
        category: r.category,
        text: r.title,
        indicators: [],
      })),
    ];
    const categories = Object.entries(
      all.reduce(
        (o: any, x: any) => ((o[x.category] = (o[x.category] || 0) + 1), o),
        {},
      ),
    ).sort((a: any, b: any) => b[1] - a[1]);
    const hints = [
      ["KYC / verification", "verify|kyc|account", all],
      ["Rewards / advance fees", "reward|prize|won|fee", all],
      ["Shortened links", "bit\.ly|tinyurl|t\.co", all],
    ];
    return {
      categories,
      hints: hints.map(([n, re, items]: any) => ({
        name: n,
        count: items.filter((x: any) => new RegExp(re, "i").test(x.text))
          .length,
      })),
    };
  }, [scans, reports]);
  return (
    <>
      <PageHead
        eyebrow="AGGREGATE INDICATORS"
        title="Scam pattern radar"
        subtitle="Recurring themes across local sample reports and scans."
      />
      <div className="radar-banner">
        <Activity size={18} />
        <span>
          <b>Illustrative local patterns</b>
          <small>
            These similarities do not prove incidents share a source or actor.
            No live threat intelligence is connected.
          </small>
        </span>
      </div>
      <div className="radar-grid">
        <div className="panel radar-card">
          <div className="panel-heading">
            <div>
              <h3>Common categories</h3>
              <p>Counts from saved demo items</p>
            </div>
          </div>
          {patterns.categories.map(([n, c]: any) => (
            <div className="pattern-row" key={n}>
              <span className="pattern-dot" />
              <b>{n}</b>
              <div className="pattern-track">
                <i
                  style={{
                    width: `${(c / Math.max(1, scans.length + reports.length)) * 100}%`,
                  }}
                />
              </div>
              <strong>{c}</strong>
            </div>
          ))}
        </div>
        <div className="panel radar-card">
          <div className="panel-heading">
            <div>
              <h3>Recurring signals</h3>
              <p>Simple phrase and domain patterns</p>
            </div>
          </div>
          {patterns.hints.map((p: any) => (
            <div className="signal-row" key={p.name}>
              <span className="signal-icon">
                <Fingerprint size={15} />
              </span>
              <span>
                <b>{p.name}</b>
                <small>Appears in current sample</small>
              </span>
              <strong>{p.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
function Admin({ scans, reports, risks, data }: any) {
  return (
    <>
      <PageHead
        eyebrow="LOCAL DEMO VIEW"
        title="Admin analytics"
        subtitle="Illustrative prototype data for evaluating the experience."
      />
      <div className="notice-box">
        <Shield size={16} />
        <span>
          This is a local demo view, not secure administration. No
          authentication or role management is configured. Metrics below reflect
          only local sample data.
        </span>
      </div>
      <div className="stat-row">
        <MiniStat label="Total reports" value={reports.length} />
        <MiniStat label="Scans analyzed" value={scans.length} />
        <MiniStat
          label="High risk flags"
          value={scans.filter((s: Scan) => s.level === "High").length}
        />
        <MiniStat label="User feedback" value="Not collected" />
      </div>
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Illustrative scan volume</h3>
              <p>Sample trend, not real-world activity</p>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="#1e2b3a" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7f8da0", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#7f8da0", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111d2c",
                    border: "1px solid #26364a",
                  }}
                />
                <Bar dataKey="scans" fill="#45c5e6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <h3>Risk level counts</h3>
              <p>Current browser data</p>
            </div>
          </div>
          {risks.map((r: any) => (
            <div className="pattern-row" key={r.name}>
              <b>{r.name}</b>
              <div className="pattern-track">
                <i
                  className={r.name.toLowerCase()}
                  style={{
                    width: `${(r.value / Math.max(1, scans.length)) * 100}%`,
                  }}
                />
              </div>
              <strong>{r.value}</strong>
            </div>
          ))}
          <div className="evaluation-note">
            <b>Detection evaluation</b>
            <p>
              No labelled benchmark is included. Accuracy metrics are not
              calculated or claimed.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
function SettingsPage({ flash }: any) {
  const [alerts, setAlerts] = useState(() => getStore("cs-alerts", false)),
    [voice, setVoice] = useState(() => getStore("cs-voice", "Hindi")),
    [threshold, setThreshold] = useState(() => getStore("cs-threshold", 60));
  const save = (k: string, v: any, fn: any) => {
    localStorage.setItem(k, JSON.stringify(v));
    fn(v);
  };
  const test = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        voice === "Hindi"
          ? "यह CyberShield AI का प्रदर्शन अलर्ट है। एक संदिग्ध संदेश पर ध्यान दें।"
          : "This is a CyberShield AI demonstration alert. A suspicious item needs your attention.",
      );
      utterance.lang = voice === "Hindi" ? "hi-IN" : "en-US";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
    flash("Demo alert triggered. No background monitoring is active.");
  };
  return (
    <>
      <PageHead
        eyebrow="YOUR PREFERENCES"
        title="Settings & privacy"
        subtitle="Control local demo preferences and understand how your data is handled."
      />
      <div className="settings-layout">
        <div className="panel settings-card">
          <div className="settings-section">
            <div className="settings-icon">
              <Bell size={17} />
            </div>
            <div className="settings-copy">
              <b>Demonstration alerts</b>
              <small>
                In-app and optional browser speech alerts. This web app cannot
                monitor other apps.
              </small>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={alerts}
                onChange={(e) => save("cs-alerts", e.target.checked, setAlerts)}
              />
              <span />
            </label>
          </div>
          <div className="setting-control">
            <label>
              Alert threshold <b>{threshold}+ risk points</b>
            </label>
            <input
              type="range"
              min="20"
              max="90"
              step="10"
              value={threshold}
              onChange={(e) =>
                save("cs-threshold", Number(e.target.value), setThreshold)
              }
            />
            <div className="range-ends">
              <span>More alerts</span>
              <span>Fewer alerts</span>
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-icon">
              <MessageSquareText size={17} />
            </div>
            <div className="settings-copy">
              <b>Voice language</b>
              <small>Only used when you press “Test demo alert”.</small>
            </div>
            <select
              value={voice}
              onChange={(e) => save("cs-voice", e.target.value, setVoice)}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <div className="settings-section">
            <div className="settings-icon">
              <Activity size={17} />
            </div>
            <div className="settings-copy">
              <b>Test a demo alert</b>
              <small>
                Uses the browser’s supported text-to-speech capability.
              </small>
            </div>
            <button className="secondary" onClick={test}>
              Test alert <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
        <div className="panel settings-card">
          <div className="panel-heading">
            <div>
              <h3>Privacy & data</h3>
              <p>Local demo storage on this device</p>
            </div>
          </div>
          <div className="privacy-item">
            <LockKeyhole size={16} />
            <span>
              <b>What is stored</b>
              <small>
                Scans, SafeVault copies, reports, and lesson progress are stored
                in this browser’s local storage.
              </small>
            </span>
          </div>
          <div className="privacy-item">
            <Globe2 size={16} />
            <span>
              <b>External services</b>
              <small>
                Message and URL analysis run locally. No content is sent to AI
                or reputation providers.
              </small>
            </span>
          </div>
          <div className="privacy-item">
            <Shield size={16} />
            <span>
              <b>Not included</b>
              <small>
                No inbox/SMS monitoring, account login, secure cloud backup, or
                live threat intelligence.
              </small>
            </span>
          </div>
          <div className="settings-divider" />
          <div className="delete-row">
            <div>
              <b>Delete local data</b>
              <small>
                Remove scans, vault copies, reports, and learning progress.
              </small>
            </div>
            <button
              className="danger"
              onClick={() => {
                ["cs-scans", "cs-vault", "cs-reports", "cs-lessons"].forEach(
                  localStorage.removeItem.bind(localStorage),
                );
                location.reload();
              }}
            >
              <Trash2 size={14} /> Delete data
            </button>
          </div>
        </div>
        <div className="panel settings-card">
          <div className="panel-heading">
            <div>
              <h3>Detection disclaimer</h3>
              <p>Understand the limits of automated analysis</p>
            </div>
          </div>
          <p className="body-copy">
            CyberShield AI uses a transparent baseline rules engine to identify
            possible indicators. Its risk score is not a calibrated probability.
            A high score does not prove fraud, and a low score does not
            guarantee safety. Use independent verification and contact official
            providers when needed.
          </p>
        </div>
      </div>
    </>
  );
}
