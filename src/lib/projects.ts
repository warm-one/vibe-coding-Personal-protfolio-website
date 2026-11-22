import { getCollection, type CollectionEntry } from "astro:content";
import { defaultLang, locales, type Lang } from "../i18n/ui";

export type Project = CollectionEntry<"projects">;

export interface LocalizedProject {
  entry: Project;
  slug: string;
  lang: Lang;
  fallback: boolean;
}

function slugOf(id: string): string {
  const parts = id.split("/");
  return (locales as readonly string[]).includes(parts[0])
    ? parts.slice(1).join("/")
    : id;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const all = await getCollection("projects");
  return [...new Set(all.map((entry) => slugOf(entry.id)))];
}

export async function getProjects(lang: Lang): Promise<LocalizedProject[]> {
  const all = await getCollection("projects");
  const grouped = new Map<string, Project[]>();

  for (const entry of all) {
    const slug = slugOf(entry.id);
    const list = grouped.get(slug) ?? [];
    list.push(entry);
    grouped.set(slug, list);
  }

  const resolved: LocalizedProject[] = [];
  for (const [slug, entries] of grouped) {
    const exact = entries.find((entry) => entry.data.lang === lang);
    const fallbackEntry = entries.find(
      (entry) => entry.data.lang === defaultLang,
    );
    const entry = exact ?? fallbackEntry;
    if (!entry) continue;
    resolved.push({ entry, slug, lang, fallback: !exact });
  }

  return resolved.sort((a, b) => {
    const featured = Number(b.entry.data.featured) - Number(a.entry.data.featured);
    if (featured !== 0) return featured;
    const byDate = b.entry.data.date.getTime() - a.entry.data.date.getTime();
    if (byDate !== 0) return byDate;
    return a.slug.localeCompare(b.slug);
  });
}

export function collectTags(projects: LocalizedProject[]): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

export async function getProject(
  lang: Lang,
  slug: string,
): Promise<LocalizedProject | undefined> {
  const projects = await getProjects(lang);
  return projects.find((project) => project.slug === slug);
}