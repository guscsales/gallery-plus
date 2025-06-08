import { z } from 'zod';

// Zod schemas for validation
export const createAlbumSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long')
});

export const albumParamsSchema = z.object({
  id: z.string().uuid('Invalid album ID format')
});

// TypeScript types derived from schemas
export type CreateAlbumRequest = z.infer<typeof createAlbumSchema>;
export type AlbumParams = z.infer<typeof albumParamsSchema>; 