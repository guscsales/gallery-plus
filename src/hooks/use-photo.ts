import {useQuery} from "@tanstack/react-query";
import {fetcher} from "../helpers/api";
import type {Photo} from "../models/photo";

export default function usePhoto(id: string) {
	const {data, isLoading} = useQuery<Photo>({
		queryKey: ["photo", id],
		queryFn: () => fetcher(`/photos/${id}`),
	});

	return {
		photo: data,
		isLoadingPhoto: isLoading,
	};
}
