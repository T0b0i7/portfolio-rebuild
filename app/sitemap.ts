import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { posts, projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/uses", "/services", "/guestbook", "/bucket-list", "/links"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    }),
  );

  const projectRoutes = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${base}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
