import type { Project } from "./projects";
import { localizePath } from "../i18n/utils";
import type { Lang, UIKey } from "../i18n/ui";

export type ProjectType = Project["data"]["type"];

export interface Category {
  key: Exclude<ProjectType, "other">;
}

export interface CategoryWithCount extends Category {
  count: number;
}

export const CATEGORIES: Category[] = [
  { key: "web" },
  { key: "game" },
  { key: "tool" },
];

const LABEL_KEY: Record<Category["key"], UIKey> = {
  web: "catWeb",
  game: "catGame",
  tool: "catTool",
};

const BLURB_KEY: Record<Category["key"], UIKey> = {
  web: "catWebBlurb",
  game: "catGameBlurb",
  tool: "catToolBlurb",
};

const TYPE_LABEL_KEY: Record<ProjectType, UIKey> = {
  web: "catWeb",
  game: "catGame",
  tool: "catTool",
  other: "catOther",
};

export function categoryLabelKey(key: Category["key"]): UIKey {
  return LABEL_KEY[key];
}

export function categoryBlurbKey(key: Category["key"]): UIKey {
  return BLURB_KEY[key];
}

export function projectTypeLabelKey(type: ProjectType): UIKey {
  return TYPE_LABEL_KEY[type];
}

export function categoryHref(key: Category["key"], lang: Lang): string {
  return localizePath(`/projects/category/${key}`, lang);
}

export function isCategoryKey(value: string): value is Category["key"] {
  return CATEGORIES.some((category) => category.key === value);
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