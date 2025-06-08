import {writeFile, unlink, mkdir} from "fs/promises";
import {existsSync} from "fs";
import {join, resolve, extname} from "path";
import {randomUUID} from "crypto";

export class ImageService {
	private imagesDir: string;

	constructor() {
		this.imagesDir = resolve(process.cwd(), "data", "images");
	}

	private async ensureImagesDirExists(): Promise<void> {
		if (!existsSync(this.imagesDir)) {
			await mkdir(this.imagesDir, {recursive: true});
		}
	}

	async uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
		// Validate image type
		const allowedExtensions = [".jpg", ".jpeg", ".png"];
		const ext = extname(filename).toLowerCase();
		
		if (!allowedExtensions.includes(ext)) {
			throw new Error("Invalid image format. Only JPG, JPEG, and PNG are allowed.");
		}

		// Check file size (50MB limit)
		const maxSize = 50 * 1024 * 1024; // 50MB
		if (imageBuffer.length > maxSize) {
			throw new Error("Image size exceeds 50MB limit.");
		}

		// Ensure images directory exists
		await this.ensureImagesDirExists();

		// Generate unique image ID and save file
		const imageId = randomUUID();
		const imageFilename = `${imageId}${ext}`;
		const imagePath = join(this.imagesDir, imageFilename);

		await writeFile(imagePath, imageBuffer);

		return `${imageId}${ext}`;
	}

	async deleteImage(imageId: string): Promise<void> {
		const imagePath = join(this.imagesDir, imageId);
		const extensions = [".jpg", ".jpeg", ".png"];
		
		for (const ext of extensions) {
			const fullPath = `${imagePath}${ext}`;
			if (existsSync(fullPath)) {
				try {
					await unlink(fullPath);
				} catch (error) {
					console.error("Error deleting image file:", error);
				}
				break;
			}
		}
	}

	async replaceImage(oldImageId: string, imageBuffer: Buffer, filename: string): Promise<string> {
		// Delete old image
		await this.deleteImage(oldImageId);
		
		// Upload new image
		return await this.uploadImage(imageBuffer, filename);
	}

	getImagesDir(): string {
		return this.imagesDir;
	}

	getImagePath(imageId: string, extension: string): string {
		return join(this.imagesDir, `${imageId}${extension}`);
	}
}
