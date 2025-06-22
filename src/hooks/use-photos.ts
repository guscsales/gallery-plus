import {useQuery} from "@tanstack/react-query";
import {fetcher} from "../helpers/api";
import type {Photo} from "../models/photo";

export default function usePhotos() {
	const {data, isLoading} = useQuery<Photo[]>({
		queryKey: ["photos"],
		queryFn: () => fetcher("/photos"),
	});

	return {
		photos: data || [],
		isLoadingPhotos: isLoading,
	};
}
