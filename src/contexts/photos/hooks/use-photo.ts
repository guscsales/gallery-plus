import {useQuery, useQueryClient} from "@tanstack/react-query";
import {api, fetcher} from "../../../helpers/api";
import type {Photo} from "../models/photo";
import type {PhotoNewForm} from "../schemas";
import {toast} from "sonner";

interface PhotoDetailResponse extends Photo {
	nextPhotoId: string | null;
	previousPhotoId: string | null;
}

export default function usePhoto(id?: string) {
	const {data, isLoading} = useQuery<PhotoDetailResponse>({
		queryKey: ["photo", id],
		queryFn: () => fetcher(`/photos/${id}`),
		enabled: !!id,
	});

	const queryClient = useQueryClient();

	async function createPhoto(payload: PhotoNewForm) {
		try {
			const {data} = await api.post<Photo>("/photos", {
				title: payload.title,
			});

			await api.post(
				`/photos/${data.id}/image`,
				{file: payload.file[0]},
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (payload.albumsIds) {
				await api.put(`/photos/${data.id}/albums`, {
					albumsIds: payload.albumsIds,
				});
			}

			queryClient.invalidateQueries({queryKey: ["photos"]});

			toast.success("Foto criada com sucesso");
		} catch (error) {
			toast.error("Erro ao criar foto");
			throw error;
		}
	}

	return {
		photo: data,
		nextPhotoId: data?.nextPhotoId,
		previousPhotoId: data?.previousPhotoId,
		isLoadingPhoto: isLoading,
		createPhoto,
	};
}
