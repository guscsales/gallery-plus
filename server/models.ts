export interface Photo {
  id: string;
  title: string;
  imageId?: string;
}

export interface Album {
  id: string;
  title: string;
}

export interface PhotoOnAlbum {
  photo_id: string;
  album_id: string;
}

export interface Database {
  photos: Photo[];
  albums: Album[];
  photosOnAlbums: PhotoOnAlbum[];
} 