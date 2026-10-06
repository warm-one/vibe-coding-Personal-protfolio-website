import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      cover: image(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      type: z.enum(["web", "game", "tool", "other"]).default("web"),
      featured: z.boolean().default(false),
      links: z
        .object({
          github: z.url().optional(),
          demo: z.url().optional(),
        })
        .default({}),
      gallery: z.array(image()).default([]),
    }),
});

export const collections = { projects };
