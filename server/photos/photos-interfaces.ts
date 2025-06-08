import { z } from 'zod';

// Zod schemas for validation
export const createPhotoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long')
});

export const updatePhotoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long')
});

export const photoParamsSchema = z.object({
  id: z.string().uuid('Invalid photo ID format')
});

export const photoQuerySchema = z.object({
  albumId: z.string().uuid('Invalid album ID format').optional()
});

// TypeScript types derived from schemas
export type CreatePhotoRequest = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoRequest = z.infer<typeof updatePhotoSchema>;
export type PhotoParams = z.infer<typeof photoParamsSchema>;
export type PhotoQuery = z.infer<typeof photoQuerySchema>; 