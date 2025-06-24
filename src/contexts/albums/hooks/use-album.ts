import {useQueryClient} from "@tanstack/react-query";
import {api} from "../../../helpers/api";
import {toast} from "sonner";
import type {AlbumNewForm} from "../schemas";
import type {Album} from "../models/album";

export default function useAlbum() {
	const queryClient = useQueryClient();

	async function createAlbum(payload: AlbumNewForm) {
		try {
			const {data} = await api.post<Album>("/albums", {
				title: payload.title,
			});

			if (payload.photosIds) {
				await Promise.all(
					payload.photosIds.map((photoId) =>
						api.put(`/photos/${photoId}/albums`, {
							albumsIds: [data.id],
						})
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
