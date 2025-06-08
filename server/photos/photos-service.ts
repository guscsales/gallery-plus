import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../services/database-service';
import { Photo } from '../models';
import { CreatePhotoRequest, UpdatePhotoRequest } from './photos-interfaces';

export class PhotosService {
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  async getAllPhotos(albumId?: string): Promise<Photo[]> {
    const db = await this.dbService.readDatabase();
    
    if (albumId) {
      const photoIds = db.photosOnAlbums
        .filter(relation => relation.album_id === albumId)
        .map(relation => relation.photo_id);
      
      return db.photos.filter(photo => photoIds.includes(photo.id));
    }
    
    return db.photos;
  }

  async getPhotoById(id: string): Promise<Photo | null> {
    const db = await this.dbService.readDatabase();
    return db.photos.find(photo => photo.id === id) || null;
  }

  async createPhoto(photoData: CreatePhotoRequest): Promise<Photo> {
    const photoId = randomUUID();

    const photo: Photo = {
      id: photoId,
      title: photoData.title
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
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = extname(filename).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      throw new Error('Invalid image format. Only JPG, JPEG, and PNG are allowed.');
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (imageBuffer.length > maxSize) {
      throw new Error('Image size exceeds 50MB limit.');
    }

    const db = await this.dbService.readDatabase();
    const photoIndex = db.photos.findIndex(photo => photo.id === photoId);
    
    if (photoIndex === -1) {
      return null;
    }

    // Remove old image if exists
    const photo = db.photos[photoIndex];
    if (photo.imageId) {
      await this.removeImageFile(photo.imageId);
    }

    // Save new image
    const imageId = randomUUID();
    const imageFilename = `${imageId}${ext}`;
    const imagePath = join(this.dbService.getImagesDir(), imageFilename);

    await writeFile(imagePath, imageBuffer);

    // Update photo with new imageId
    db.photos[photoIndex].imageId = imageId;
    await this.dbService.writeDatabase(db);

    return db.photos[photoIndex];
  }

  private async removeImageFile(imageId: string): Promise<void> {
    const imagePath = join(this.dbService.getImagesDir(), imageId);
    const extensions = ['.jpg', '.jpeg', '.png'];
    
    for (const ext of extensions) {
      const fullPath = `${imagePath}${ext}`;
      if (existsSync(fullPath)) {
        try {
          await unlink(fullPath);
        } catch (error) {
          console.error('Error deleting image file:', error);
        }
        break;
      }
    }
  }

  async updatePhoto(id: string, updateData: UpdatePhotoRequest): Promise<Photo | null> {
    const db = await this.dbService.readDatabase();
    const photoIndex = db.photos.findIndex(photo => photo.id === id);
    
    if (photoIndex === -1) {
      return null;
    }

    db.photos[photoIndex].title = updateData.title;
    await this.dbService.writeDatabase(db);

    return db.photos[photoIndex];
  }

  async deletePhoto(id: string): Promise<boolean> {
    const db = await this.dbService.readDatabase();
    const photoIndex = db.photos.findIndex(photo => photo.id === id);
    
    if (photoIndex === -1) {
      return false;
    }

    const photo = db.photos[photoIndex];
    
    // Delete image file if exists
    if (photo.imageId) {
      await this.removeImageFile(photo.imageId);
    }

    // Remove photo from database
    db.photos.splice(photoIndex, 1);
    
    // Remove from albums relationships
    db.photosOnAlbums = db.photosOnAlbums.filter(
      relation => relation.photo_id !== id
    );
    
    await this.dbService.writeDatabase(db);
    return true;
  }

  async addPhotoToAlbum(photoId: string, albumId: string): Promise<boolean> {
    const db = await this.dbService.readDatabase();
    
    const photoExists = db.photos.some(photo => photo.id === photoId);
    const albumExists = db.albums.some(album => album.id === albumId);
    
    if (!photoExists || !albumExists) {
      return false;
    }

    const relationExists = db.photosOnAlbums.some(
      relation => relation.photo_id === photoId && relation.album_id === albumId
    );
    
    if (relationExists) {
      return true;
    }

    db.photosOnAlbums.push({
      photo_id: photoId,
      album_id: albumId
    });
    
    await this.dbService.writeDatabase(db);
    return true;
  }
} 