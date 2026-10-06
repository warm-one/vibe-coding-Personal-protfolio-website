import type { Project } from "./projects";

export type ProjectType = Project["data"]["type"];

export interface Category {
  key: Exclude<ProjectType, "other">;
  label: string;
  blurb: string;
}

export interface CategoryWithCount extends Category {
  count: number;
}

export const CATEGORIES: Category[] = [
  { key: "web", label: "网页应用", blurb: "网站与 Web 应用" },
  { key: "game", label: "小游戏", blurb: "可玩的小游戏与交互演示" },
  { key: "tool", label: "工具", blurb: "自用的在线小工具" },
];

export function categoryHref(key: Category["key"]): string {
  return `/projects/category/${key}`;
}

export function isCategoryKey(value: string): value is Category["key"] {
  return CATEGORIES.some((category) => category.key === value);
}

export function categoryLabel(key: ProjectType): string {
  return CATEGORIES.find((category) => category.key === key)?.label ?? "其他";
}

export function categoriesWithCounts(
  projects: { data: { type: ProjectType } }[],
): CategoryWithCount[] {
  return CATEGORIES.map((category) => ({
    ...category,
    count: projects.filter((project) => project.data.type === category.key)
      .length,
  }));
}
