import {useQueryClient} from "@tanstack/react-query";
import {api} from "../../../helpers/api";
import {toast} from "sonner";
import type {AlbumNewForm} from "../schemas";
import type {Album} from "../models/album";
import usePhotoAlbums from "../../photos/hooks/use-photo-albums";

export default function useAlbum() {
	const queryClient = useQueryClient();
	const {managePhotoOnAlbums} = usePhotoAlbums();

	async function createAlbum(payload: AlbumNewForm) {
		try {
			const {data} = await api.post<Album>("/albums", {
				title: payload.title,
			});

			if (payload.photosIds) {
				await Promise.all(
					payload.photosIds.map((photoId) =>
						managePhotoOnAlbums(photoId, [data.id])
					)
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
