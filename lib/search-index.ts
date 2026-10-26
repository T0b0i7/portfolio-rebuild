import { posts, projects } from "./content";

export type SearchEntry = {
  id: string;
  title: string;
  hint: string;
  group: "Project" | "Writing" | "Page";
  href: string;
  keywords: string;
};

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...projects.map((project) => ({
      id: `project:${project.slug}`,
      title: project.title,
      hint: project.tagline,
      group: "Project" as const,
      href: `/work/${project.slug}`,
      keywords: [project.summary, ...project.stack, ...project.facets].join(" "),
    })),
    ...posts.map((post) => ({
      id: `post:${post.slug}`,
      title: post.title,
      hint: `${post.minutes} min read`,
      group: "Writing" as const,
      href: `/writing/${post.slug}`,
      keywords: `${post.excerpt} ${post.eyebrow}`,
    })),
    {
      id: "page:work",
      title: "Curated work",
      hint: "Selected projects",
      group: "Page" as const,
      href: "/#work",
      keywords: "projects portfolio",
    },
    {
      id: "page:about",
      title: "About",
      hint: "Journey, skills, experience",
      group: "Page" as const,
      href: "/#about",
      keywords: "profile stack experience cv",
    },
    {
      id: "page:contact",
      title: "Contact",
      hint: "Start a conversation",
      group: "Page" as const,
      href: "/#contact",
      keywords: "email hello hire",
    },
  ];
}
