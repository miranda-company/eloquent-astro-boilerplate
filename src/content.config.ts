import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const legalPage = z.object({
  intro: z.string(),
  updated: z.string().optional(),
  notice: z
    .object({
      title: z.string(),
      text: z.string(),
    })
    .optional(),
  summary: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .default([]),
  navigation: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        label: z.string(),
      }),
    )
    .min(1),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      locale: z.literal('es'),
      slug: z.string().optional(),
      draft: z.boolean().default(false),
      template: z.enum(['standard', 'legal']).default('standard'),
      legal: legalPage.optional(),
    })
    .superRefine((data, context) => {
      if (data.template === 'legal' && !data.legal)
        context.addIssue({
          code: 'custom',
          message: 'Legal pages require legal layout configuration.',
          path: ['legal'],
        });
    }),
});

export const collections = { pages };
