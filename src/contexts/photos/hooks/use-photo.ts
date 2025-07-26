import {useQuery, useQueryClient} from "@tanstack/react-query";
import {api, fetcher} from "../../../helpers/api";
import type {Photo} from "../models/photo";
import type {PhotoNewFormSchema} from "../schemas";
import {toast} from "sonner";
import usePhotoAlbums from "./use-photo-albums";
import {useNavigate} from "react-router";

interface PhotoDetailResponse extends Photo {
  nextPhotoId?: string;
  previousPhotoId?: string;
}

export default function usePhoto(id?: string) {
  const navigate = useNavigate();
  const {data, isLoading} = useQuery<PhotoDetailResponse>({
    queryKey: ["photo", id],
    queryFn: () => fetcher(`/photos/${id}`),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const {managePhotoOnAlbum} = usePhotoAlbums();

  async function createPhoto(payload: PhotoNewFormSchema) {
    try {
      const {data: photo} = await api.post<Photo>("/photos", {
        title: payload.title,
      });

      await api.post(
        `/photos/${photo.id}/image`,
        {
          file: payload.file[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (payload.albumsIds && payload.albumsIds.length > 0) {
        await managePhotoOnAlbum(photo.id, payload.albumsIds);
      }

      queryClient.invalidateQueries({queryKey: ["photos"]});

      toast.success("Foto criada com sucesso");
    } catch (error) {
      toast.error("Erro ao criar foto");
      throw error;
    }
  }

  async function deletePhoto(photoId: string) {
    try {
      await api.delete(`/photos/${photoId}`);

      toast.success("Foto excluída com sucesso");

      navigate("/");
    } catch (error) {
      toast.error("Erro ao excluir foto");
      throw error;
    }
  }

  return {
    photo: data,
    nextPhotoId: data?.nextPhotoId,
    previousPhotoId: data?.previousPhotoId,
    isLoadingPhoto: isLoading,
    createPhoto,
    deletePhoto,
  };
}
