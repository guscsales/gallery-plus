import {useQuery} from "@tanstack/react-query";
import {fetcher} from "../helpers/api";
import type {Photo} from "../models/photo";

interface PhotoDetailResponse extends Photo {
	nextPhotoId: string | null;
	previousPhotoId: string | null;
}

export default function usePhoto(id: string) {
	const {data, isLoading} = useQuery<PhotoDetailResponse>({
		queryKey: ["photo", id],
		queryFn: () => fetcher(`/photos/${id}`),
	});

	return {
		photo: data,
		nextPhotoId: data?.nextPhotoId,
		previousPhotoId: data?.previousPhotoId,
		isLoadingPhoto: isLoading,
	};
}
