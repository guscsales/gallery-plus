import {useQuery} from "@tanstack/react-query";
import {fetcher} from "../helpers/api";
import type {Album} from "../models/album";

export default function useAlbums() {
	const {data, isLoading} = useQuery<Album[]>({
		queryKey: ["albums"],
		queryFn: () => fetcher("/albums"),
	});

	return {
		albums: data,
		isLoadingAlbums: isLoading,
	};
}
