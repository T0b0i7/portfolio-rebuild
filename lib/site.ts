export const site = {
  name: "Your Name",
  role: "Full-stack engineer",
  headline: "Complex web apps, from pixels to pipelines",
  location: "Remote · GMT+1",
  email: "hello@example.com",
  url: "https://example.com",
  description:
    "Full-stack engineer. Typed end to end: system design, resilient APIs, and interfaces that stay fast under load.",
  intro:
    "I design and ship production systems end to end: typed APIs, resilient data layers, and interfaces that stay fast under load.",
  nav: [
    { label: "Projects", href: "/#work" },
    { label: "Blog", href: "/#writing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  pages: [
    { label: "Projects", href: "/#work" },
    { label: "Blog", href: "/#writing" },
    { label: "About", href: "/#about" },
    { label: "Uses", href: "/uses" },
    { label: "Services", href: "/services" },
    { label: "Guestbook", href: "/guestbook" },
    { label: "Bucket List", href: "/bucket-list" },
    { label: "Links", href: "/links" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "RSS", href: "/feed.xml" },
  ],
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Node",
    "Postgres",
    "Python",
    "Tailwind",
    "Playwright",
  ],
} as const;
