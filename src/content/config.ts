import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    authors: z.array(z.string()).default(['amir']), // Array of author IDs
  }),
});

export const collections = { blog };
