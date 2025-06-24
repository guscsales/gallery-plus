import {randomUUID} from "crypto";
import {DatabaseService} from "../services/database-service.ts";
import {ImageService} from "../services/image-service.ts";
import {Album, Photo} from "../models.ts";
import {
	CreatePhotoRequest,
	UpdatePhotoRequest,
	ManagePhotoAlbumsRequest,
} from "./photos-interfaces.ts";

export class PhotosService {
	private dbService: DatabaseService;
	private imageService: ImageService;

	constructor(dbService: DatabaseService, imageService: ImageService) {
		this.dbService = dbService;
		this.imageService = imageService;
	}

	private async populatePhotoAlbums(
		photo: Photo,
		photosOnAlbums: Array<{photoId: string; albumId: string}>
	): Promise<Photo & {albums: Album[]}> {
		const db = await this.dbService.readDatabase();
		const albumPromises = photosOnAlbums
			.filter((relation) => relation.photoId === photo.id)
			.map((relation) =>
				db.albums.find((album) => album.id === relation.albumId)
			);

		const albums = await Promise.all(albumPromises);

		return {
			...photo,
			albums:
				albums.filter((album): album is Album => album !== undefined) || [],
		};
	}

	async getAllPhotos(albumId?: string, q?: string): Promise<Photo[]> {
		const db = await this.dbService.readDatabase();

		let photos: Photo[] = db.photos;

		if (q) {
			photos = photos.filter((photo) =>
				photo.title.toLowerCase().includes(q.toLowerCase())
			);
		}

		if (albumId) {
			const photoIds = db.photosOnAlbums
				.filter((relation) => relation.albumId === albumId)
				.map((relation) => relation.photoId);

			photos = photos.filter((photo) => photoIds.includes(photo.id));
		}

		// Populate albumIds for each photo
		const populatedPhotos = await Promise.all(
			photos.map((photo) => this.populatePhotoAlbums(photo, db.photosOnAlbums))
		);

		return populatedPhotos;
	}

	async getPhotoById(
		id: string
	): Promise<
		| (Photo & {nextPhotoId: string | null; previousPhotoId: string | null})
		| null
	> {
		const db = await this.dbService.readDatabase();
		const photo = db.photos.find((photo) => photo.id === id);

		if (!photo) {
			return null;
		}

		const photos = await this.getAllPhotos();

		const nextPhoto =
			photos.findIndex((p) => p.id === photo.id) + 1 < photos.length
				? photos[photos.findIndex((p) => p.id === photo.id) + 1].id
				: null;
		const previousPhoto =
			photos.findIndex((p) => p.id === photo.id) - 1 >= 0
				? photos[photos.findIndex((p) => p.id === photo.id) - 1].id
				: null;

		return {
			...(await this.populatePhotoAlbums(photo, db.photosOnAlbums)),
			nextPhotoId: nextPhoto,
			previousPhotoId: previousPhoto,
		};
	}

	async createPhoto(photoData: CreatePhotoRequest): Promise<Photo> {
		const photoId = randomUUID();

		const photo: Photo = {
			id: photoId,
			title: photoData.title,
			albumsIds: photoData.albumsIds || [],
			// imageId will be added when image is uploaded
		};

		const db = await this.dbService.readDatabase();
		db.photos.push(photo);
		await this.dbService.writeDatabase(db);

		return photo;
	}

	async uploadImage(
		photoId: string,
		imageBuffer: Buffer,
		filename: string
	): Promise<Photo | null> {
		const db = await this.dbService.readDatabase();
		const photoIndex = db.photos.findIndex((photo) => photo.id === photoId);

		if (photoIndex === -1) {
			return null;
		}

		// If photo already has an image, delete it first
		if (db.photos[photoIndex].imageId) {
			await this.imageService.deleteImage(db.photos[photoIndex].imageId);
		}

		const imageId = await this.imageService.uploadImage(imageBuffer, filename);

		// Update photo with new imageId
		db.photos[photoIndex].imageId = imageId;
		await this.dbService.writeDatabase(db);

		return await this.populatePhotoAlbums(
			db.photos[photoIndex],
			db.photosOnAlbums
		);
	}

	async updatePhoto(
		id: string,
		updateData: UpdatePhotoRequest
	): Promise<Photo | null> {
		const db = await this.dbService.readDatabase();
		const photoIndex = db.photos.findIndex((photo) => photo.id === id);

		if (photoIndex === -1) {
			return null;
		}

		db.photos[photoIndex].title = updateData.title;
		await this.dbService.writeDatabase(db);

		return await this.populatePhotoAlbums(
			db.photos[photoIndex],
			db.photosOnAlbums
		);
	}

	async deletePhoto(id: string): Promise<boolean> {
		const db = await this.dbService.readDatabase();
		const photoIndex = db.photos.findIndex((photo) => photo.id === id);

		if (photoIndex === -1) {
			return false;
		}

		const photo = db.photos[photoIndex];

		// Delete image file if exists using ImageService
		if (photo.imageId) {
			await this.imageService.deleteImage(photo.imageId);
		}

		// Remove photo from database
		db.photos.splice(photoIndex, 1);

		// Remove from albums relationships
		db.photosOnAlbums = db.photosOnAlbums.filter(
			(relation) => relation.photoId !== id
		);

		await this.dbService.writeDatabase(db);
		return true;
	}

	async addPhotoToAlbum(photoId: string, albumId: string): Promise<boolean> {
		const db = await this.dbService.readDatabase();

		const photoExists = db.photos.some((photo) => photo.id === photoId);
		const albumExists = db.albums.some((album) => album.id === albumId);

		if (!photoExists || !albumExists) {
			return false;
		}

		const relationExists = db.photosOnAlbums.some(
			(relation) => relation.photoId === photoId && relation.albumId === albumId
		);

		if (relationExists) {
			return true;
		}

		db.photosOnAlbums.push({
			photoId: photoId,
			albumId: albumId,
		});

		await this.dbService.writeDatabase(db);
		return true;
	}

	async managePhotoAlbums(
		photoId: string,
		albumsData: ManagePhotoAlbumsRequest
	): Promise<boolean> {
		const db = await this.dbService.readDatabase();

		// Check if photo exists
		const photoExists = db.photos.some((photo) => photo.id === photoId);
		if (!photoExists) {
			return false;
		}

		// Check if all provided albums exist
		const {albumsIds} = albumsData;
		for (const albumId of albumsIds) {
			const albumExists = db.albums.some((album) => album.id === albumId);
			if (!albumExists) {
				return false;
			}
		}

		// Get current albums for this photo
		const currentAlbumsIds = db.photosOnAlbums
			.filter((relation) => relation.photoId === photoId)
			.map((relation) => relation.albumId);

		// Use Sets to calculate differences
		const currentSet = new Set(currentAlbumsIds);
		const desiredSet = new Set(albumsIds);

		// Albums to add: in desired but not in current
		const albumsToAdd = [...desiredSet].filter(
			(albumId) => !currentSet.has(albumId)
		);

		// Albums to remove: in current but not in desired
		const albumsToRemove = [...currentSet].filter(
			(albumId) => !desiredSet.has(albumId)
		);

		// Remove photo from albums that should no longer contain it
		db.photosOnAlbums = db.photosOnAlbums.filter(
			(relation) =>
				relation.photoId !== photoId ||
				!albumsToRemove.includes(relation.albumId)
		);

		// Add photo to new albums
		for (const albumId of albumsToAdd) {
			db.photosOnAlbums.push({
				photoId: photoId,
				albumId: albumId,
			});
		}

		await this.dbService.writeDatabase(db);
		return true;
	}
}
