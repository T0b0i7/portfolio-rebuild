export type Facet = "frontend" | "backend" | "ai" | "tools" | "local" | "us" | "uk";

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  year: number;
  role: string;
  facets: Facet[];
  stack: string[];
  metrics: { label: string; value: string }[];
  links: { live?: string; code?: string; caseStudy?: string };
  accent: string;
};

export const filters: { id: Facet | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "frontend", label: "FRONTEND" },
  { id: "backend", label: "BACKEND" },
  { id: "ai", label: "AI" },
  { id: "tools", label: "TOOLS" },
  { id: "local", label: "LOCAL" },
  { id: "us", label: "US" },
  { id: "uk", label: "UK" },
];

export const projects: Project[] = [
  {
    slug: "atlas",
    title: "Atlas",
    eyebrow: "CURRENTLY SHIPPING",
    tagline: "Type-safe data layer for product teams",
    summary:
      "A schema-first data layer that generates typed clients, migrations and contract tests from a single source of truth.",
    year: 2026,
    role: "Lead engineer · architecture & DX",
    facets: ["backend", "frontend", "tools", "us"],
    stack: ["TypeScript", "Postgres", "Drizzle", "Next.js", "tRPC"],
    metrics: [
      { label: "Query latency", value: "-64%" },
      { label: "Contract tests", value: "1.2k" },
      { label: "Teams onboarded", value: "18" },
    ],
    links: { live: "#", code: "#", caseStudy: "#" },
    accent: "var(--accent-1)",
  },
  {
    slug: "relay",
    title: "Relay",
    eyebrow: "AI WORKFLOWS",
    tagline: "Agent orchestration with human checkpoints",
    summary:
      "Durable agent runs with typed tools, eval gates and replayable traces. Every irreversible step asks for confirmation.",
    year: 2026,
    role: "Founding engineer",
    facets: ["ai", "backend", "uk"],
    stack: ["Python", "LangGraph", "Postgres", "Redis", "React"],
    metrics: [
      { label: "Tool success", value: "98.4%" },
      { label: "Cost / run", value: "-41%" },
      { label: "Eval suite", value: "340 cases" },
    ],
    links: { live: "#", code: "#" },
    accent: "var(--accent-2)",
  },
  {
    slug: "ledger",
    title: "Ledger",
    eyebrow: "LOCAL-FIRST",
    tagline: "Offline accounting for freelancers",
    summary:
      "A local-first bookkeeping app: CRDT sync, deterministic exports and an audit trail that survives airplane mode.",
    year: 2025,
    role: "Product engineer",
    facets: ["frontend", "local", "tools"],
    stack: ["React", "SQLite", "WASM", "Yjs"],
    metrics: [
      { label: "Boot time", value: "310ms" },
      { label: "Offline ops", value: "100%" },
      { label: "Bundle", value: "84kB" },
    ],
    links: { live: "#", caseStudy: "#" },
    accent: "var(--accent-3)",
  },
  {
    slug: "prism",
    title: "Prism",
    eyebrow: "DESIGN SYSTEM",
    tagline: "Themeable components, one source of tokens",
    summary:
      "Design tokens compiled to CSS variables, Tailwind theme and Figma variables from the same JSON graph.",
    year: 2025,
    role: "Design engineer",
    facets: ["frontend", "tools", "us"],
    stack: ["React", "Tailwind v4", "Style Dictionary"],
    metrics: [
      { label: "Components", value: "64" },
      { label: "Token drift", value: "0" },
      { label: "A11y score", value: "100" },
    ],
    links: { live: "#", code: "#" },
    accent: "var(--accent-4)",
  },
  {
    slug: "signal",
    title: "Signal",
    eyebrow: "OBSERVABILITY",
    tagline: "Trace viewer built for agent runs",
    summary:
      "Streams spans from worker to browser over SSE, with a timeline that stays readable past ten thousand events.",
    year: 2024,
    role: "Backend + UI",
    facets: ["backend", "ai", "uk"],
    stack: ["Go", "OpenTelemetry", "ClickHouse", "Svelte"],
    metrics: [
      { label: "Events / s", value: "42k" },
      { label: "p95 render", value: "38ms" },
      { label: "Retention", value: "30d" },
    ],
    links: { code: "#" },
    accent: "var(--accent-5)",
  },
];

export type Post = {
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  minutes: number;
  date: string;
};

export const posts: Post[] = [
  {
    slug: "agents-that-verify",
    title: "Agents that verify their own work",
    eyebrow: "I barely type code anymore",
    excerpt:
      "How to run four coding agents in parallel: plan first, delegate to worktrees, and let each one prove its result before merging.",
    minutes: 12,
    date: "2026-10-20",
  },
  {
    slug: "cache-components",
    title: "Cache Components, explained",
    eyebrow: "Next.js 16.4",
    excerpt:
      "What changes when partial prerendering becomes the default, from ensureStatic to the flags nobody documents.",
    minutes: 11,
    date: "2026-10-07",
  },
  {
    slug: "lighthouse",
    title: "Fixing a 42 on Lighthouse",
    eyebrow: "Optimize your app",
    excerpt:
      "Bundle analysis, caching strategy, React Compiler and the next.config options that actually move the score.",
    minutes: 16,
    date: "2026-04-14",
  },
];
