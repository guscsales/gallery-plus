import {toast} from "sonner";
import {api} from "../../../helpers/api";
import {useQueryClient} from "@tanstack/react-query";

export default function usePhotoAlbums() {
	const queryClient = useQueryClient();

	async function managePhotoOnAlbums(photoId: string, albumsIds: string[]) {
		try {
			await api.put(`/photos/${photoId}/albums`, {
				albumsIds,
			});

			queryClient.invalidateQueries({queryKey: ["photo", photoId]});
		} catch (error) {
			toast.error("Erro ao gerenciar álbuns da foto");
			throw error;
		}
	}

	return {
		managePhotoOnAlbums,
	};
}
