import {toast} from "sonner";
import type {AlbumNewFormSchema} from "../schemas";
import {api} from "../../../helpers/api";
import type {Album} from "../models/album";
import {useQueryClient} from "@tanstack/react-query";
import usePhotos from "../../photos/hooks/use-photos";
import usePhotoAlbums from "../../photos/hooks/use-photo-albums";

export default function useAlbum() {
  const queryClient = useQueryClient();
  const {photos} = usePhotos();
  const {managePhotoOnAlbum} = usePhotoAlbums();

  async function createAlbum(payload: AlbumNewFormSchema) {
    try {
      const {data: album} = await api.post<Album>("/albums", {
        title: payload.title,
      });

      if (payload.photosIds && payload.photosIds.length > 0) {
        await Promise.all(
          payload.photosIds.map((photoId) => {
            const photoAlbumsIds =
              photos
                .find((photo) => photo.id === photoId)
                ?.albums?.map((album) => album.id) || [];

            return managePhotoOnAlbum(photoId, [...photoAlbumsIds, album.id]);
          })
        );
      }

      queryClient.invalidateQueries({queryKey: ["albums"]});
      queryClient.invalidateQueries({queryKey: ["photos"]});

      toast.success("Álbum criado com sucesso");
    } catch (error) {
      toast.error("Erro ao criar álbum");
      throw error;
    }
  }

  return {
    createAlbum,
  };
}
