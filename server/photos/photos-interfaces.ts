import {z} from "zod";

// Zod schemas for validation
export const createPhotoSchema = z.object({
	title: z.string().min(1).max(255),
	albumsIds: z.array(z.string().uuid()).optional(),
});

export const updatePhotoSchema = z.object({
	title: z.string().min(1).max(255),
});

export const photoParamsSchema = z.object({
	id: z.string().uuid(),
});

export const photoQuerySchema = z.object({
	albumId: z.string().uuid().optional(),
	q: z.string().optional(),
});

export const managePhotoAlbumsSchema = z.object({
	albumsIds: z.array(z.string().uuid()),
});

// TypeScript types derived from schemas
export type CreatePhotoRequest = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoRequest = z.infer<typeof updatePhotoSchema>;
export type PhotoParams = z.infer<typeof photoParamsSchema>;
export type PhotoQuery = z.infer<typeof photoQuerySchema>;
export type ManagePhotoAlbumsRequest = z.infer<typeof managePhotoAlbumsSchema>;
