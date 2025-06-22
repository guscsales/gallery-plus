import InputText from "../components/input-text";
import SearchIcon from "../assets/icons/search.svg?react";
import Divider from "../components/divider";
import usePhotos from "../hooks/use-photos";

export default function PhotosSearch() {
	const {filters} = usePhotos();

	return (
		<>
			<InputText
				icon={SearchIcon}
				placeholder="Buscar fotos"
				className="flex-1"
				value={filters.q || ""}
				onChange={(e) => filters.setQ(e.target.value)}
			/>
			<Divider orientation="vertical" className="h-10" />
		</>
	);
}
