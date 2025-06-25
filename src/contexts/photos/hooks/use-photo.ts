import {useQuery, useQueryClient} from "@tanstack/react-query";
import {api, fetcher} from "../../../helpers/api";
import type {Photo} from "../models/photo";
import type {PhotoNewForm} from "../schemas";
import {toast} from "sonner";
import {AppRoutes} from "../../../App";
import {useNavigate} from "react-router";

interface PhotoDetailResponse extends Photo {
	nextPhotoId: string | null;
	previousPhotoId: string | null;
}

export default function usePhoto(id?: string) {
	const navigate = useNavigate();
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

	async function deletePhoto(id: string) {
		try {
			await api.delete(`/photos/${id}`);

			navigate(AppRoutes.HOME);

			toast.success("Foto deletada com sucesso");
		} catch (error) {
			toast.error("Erro ao deletar foto");
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
