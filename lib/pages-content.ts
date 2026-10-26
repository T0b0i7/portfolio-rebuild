export type UseItem = { name: string; note: string };
export type UseGroup = { title: string; items: UseItem[] };

export const uses: UseGroup[] = [
  {
    title: "Workstation",
    items: [
      { name: "Laptop", note: "24GB · 1TB · external display" },
      { name: "Keyboard", note: "65% layout, tactile switches" },
      { name: "Mouse", note: "Wired, no battery to think about" },
    ],
  },
  {
    title: "Terminal & editor",
    items: [
      { name: "Ghostty", note: "Fast, GPU-rendered terminal" },
      { name: "herdr", note: "Session and agent supervision" },
      { name: "VS Code", note: "With a very small extension set" },
    ],
  },
  {
    title: "Daily tools",
    items: [
      { name: "Linear", note: "One board per project, no exceptions" },
      { name: "Obsidian", note: "Plain markdown, local first" },
      { name: "1Password", note: "Everything else lives here" },
      { name: "Cleanshot X", note: "Screenshots and short captures" },
    ],
  },
  {
    title: "Stack",
    items: [
      { name: "Next.js", note: "App Router, server components first" },
      { name: "Postgres", note: "Constraints over application checks" },
      { name: "Playwright", note: "The tests that actually catch regressions" },
    ],
  },
];

export const bucketList: { done: boolean; label: string; year?: string }[] = [
  { done: true, label: "Ship a product used by strangers", year: "2023" },
  { done: true, label: "Speak at a conference", year: "2024" },
  { done: true, label: "Run a team of agents in production", year: "2026" },
  { done: false, label: "Write a book about systems design" },
  { done: false, label: "Contribute to a compiler" },
  { done: false, label: "Live somewhere with mountains for a year" },
];

export const guestbookSeed: { name: string; message: string; date: string }[] = [
  {
    name: "Ada",
    message: "The trace viewer you built saved us a whole weekend of debugging.",
    date: "2026-10-12",
  },
  {
    name: "Kai",
    message: "Still quoting your post on evals in every architecture review.",
    date: "2026-09-28",
  },
  {
    name: "Anonymous",
    message: "This site is unreasonably fast. What did you do to the bundle?",
    date: "2026-09-04",
  },
];

export const linkGroups: { title: string; links: { label: string; href: string; note: string }[] }[] = [
  {
    title: "Elsewhere",
    links: [
      { label: "GitHub", href: "https://github.com", note: "Code, mostly small tools" },
      { label: "LinkedIn", href: "https://linkedin.com", note: "Work history" },
      { label: "X", href: "https://x.com", note: "Build notes and screenshots" },
    ],
  },
  {
    title: "Reading",
    links: [
      { label: "Overreacted", href: "https://overreacted.io", note: "Mental models for UI" },
      { label: "Increment", href: "https://increment.com", note: "How teams ship" },
      { label: "Julia Evans", href: "https://jvns.ca", note: "Debugging, explained plainly" },
    ],
  },
  {
    title: "Tools I recommend",
    links: [
      { label: "Ghostty", href: "https://ghostty.org", note: "Terminal" },
      { label: "Drizzle", href: "https://orm.drizzle.team", note: "Typed SQL" },
      { label: "Playwright", href: "https://playwright.dev", note: "Browser tests" },
    ],
  },
];
