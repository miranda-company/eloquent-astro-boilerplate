import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.literal('es'),
    slug: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
