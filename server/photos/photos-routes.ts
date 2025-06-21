import {FastifyInstance} from "fastify";
import {PhotosService} from "./photos-service.ts";
import {ZodError} from "zod";
import {
	createPhotoSchema,
	updatePhotoSchema,
	photoParamsSchema,
	photoQuerySchema,
	managePhotoAlbumsSchema,
} from "./photos-interfaces.ts";
import {MultipartFile} from "@fastify/multipart";

export async function photosRoutes(
	fastify: FastifyInstance,
	photosService: PhotosService
) {
	// GET /photos - with optional album filter
	fastify.get("/photos", async (request, reply) => {
		try {
			const queryResult = photoQuerySchema.safeParse(request.query);

			if (!queryResult.success) {
				reply.status(400).send({
					error: "Invalid query parameters",
					details: queryResult.error.errors,
				});
				return;
			}

			const {albumId, q} = queryResult.data;
			const photos = await photosService.getAllPhotos(albumId, q);
			reply.send(photos);
		} catch (error) {
			console.error("Error getting photos:", error);
			reply.status(500).send({error: "Failed to get photos"});
		}
	});

	// GET /photos/:id
	fastify.get("/photos/:id", async (request, reply) => {
		try {
			const paramsResult = photoParamsSchema.safeParse(request.params);

			if (!paramsResult.success) {
				reply.status(400).send({
					error: "Invalid photo ID",
					details: paramsResult.error.errors,
				});
				return;
			}

			const {id} = paramsResult.data;
			const photo = await photosService.getPhotoById(id);

			if (!photo) {
				reply.status(404).send({error: "Photo not found"});
				return;
			}

			reply.send(photo);
		} catch (error) {
			console.error("Error getting photo:", error);
			reply.status(500).send({error: "Failed to get photo"});
		}
	});

	// POST /photos - create photo with title only
	fastify.post("/photos", async (request, reply) => {
		try {
			const bodyResult = createPhotoSchema.safeParse(request.body);

			if (!bodyResult.success) {
				reply.status(400).send({
					error: "Invalid request data",
					details: bodyResult.error.errors,
				});
				return;
			}

			const photo = await photosService.createPhoto(bodyResult.data);
			reply.status(201).send(photo);
		} catch (error) {
			console.error("Error creating photo:", error);

			if (error instanceof ZodError) {
				reply.status(400).send({
					error: "Validation error",
					details: error.errors,
				});
				return;
			}

			reply.status(500).send({error: "Failed to create photo"});
		}
	});

	// POST /photos/:id/image - upload image for existing photo
	fastify.post("/photos/:id/image", async (request, reply) => {
		try {
			const paramsResult = photoParamsSchema.safeParse(request.params);

			if (!paramsResult.success) {
				reply.status(400).send({
					error: "Invalid photo ID",
					details: paramsResult.error.errors,
				});
				return;
			}

			const data = (await request.file()) as MultipartFile;

			if (!data) {
				reply.status(400).send({error: "No file uploaded"});
				return;
			}

			const {id} = paramsResult.data;
			const buffer = await data.toBuffer();
			const photo = await photosService.uploadImage(id, buffer, data.filename);

			if (!photo) {
				reply.status(404).send({error: "Photo not found"});
				return;
			}

			reply.send(photo);
		} catch (error) {
			console.error("Error uploading image:", error);
			reply.status(500).send({
				error:
					error instanceof Error ? error.message : "Failed to upload image",
			});
		}
	});

	// PATCH /photos/:id - update photo title
	fastify.patch("/photos/:id", async (request, reply) => {
		try {
			const paramsResult = photoParamsSchema.safeParse(request.params);
			const bodyResult = updatePhotoSchema.safeParse(request.body);

			if (!paramsResult.success) {
				reply.status(400).send({
					error: "Invalid photo ID",
					details: paramsResult.error.errors,
				});
				return;
			}

			if (!bodyResult.success) {
				reply.status(400).send({
					error: "Invalid request data",
					details: bodyResult.error.errors,
				});
				return;
			}

			const {id} = paramsResult.data;
			const photo = await photosService.updatePhoto(id, bodyResult.data);

			if (!photo) {
				reply.status(404).send({error: "Photo not found"});
				return;
			}

			reply.send(photo);
		} catch (error) {
			console.error("Error updating photo:", error);
			reply.status(500).send({error: "Failed to update photo"});
		}
	});

	// DELETE /photos/:id
	fastify.delete("/photos/:id", async (request, reply) => {
		try {
			const paramsResult = photoParamsSchema.safeParse(request.params);

			if (!paramsResult.success) {
				reply.status(400).send({
					error: "Invalid photo ID",
					details: paramsResult.error.errors,
				});
				return;
			}

			const {id} = paramsResult.data;
			const deleted = await photosService.deletePhoto(id);

			if (!deleted) {
				reply.status(404).send({error: "Photo not found"});
				return;
			}

			reply.status(204).send();
		} catch (error) {
			console.error("Error deleting photo:", error);
			reply.status(500).send({error: "Failed to delete photo"});
		}
	});

	// PUT /photos/:id/albums - manage photo albums (add/remove)
	fastify.put("/photos/:id/albums", async (request, reply) => {
		try {
			const paramsResult = photoParamsSchema.safeParse(request.params);
			const bodyResult = managePhotoAlbumsSchema.safeParse(request.body);

			if (!paramsResult.success) {
				reply.status(400).send({
					error: "Invalid photo ID",
					details: paramsResult.error.errors,
				});
				return;
			}

			if (!bodyResult.success) {
				reply.status(400).send({
					error: "Invalid request data",
					details: bodyResult.error.errors,
				});
				return;
			}

			const {id} = paramsResult.data;
			const success = await photosService.managePhotoAlbums(
				id,
				bodyResult.data
			);

			if (!success) {
				reply.status(404).send({error: "Photo not found or invalid album IDs"});
				return;
			}

			reply.send({message: "Photo albums updated successfully"});
		} catch (error) {
			console.error("Error managing photo albums:", error);
			reply.status(500).send({error: "Failed to manage photo albums"});
		}
	});
}
