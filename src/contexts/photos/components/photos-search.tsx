import InputText from "../../../components/input-text";
import SearchIcon from "../../../assets/icons/search.svg?react";
import Divider from "../../../components/divider";
import usePhotos from "../hooks/use-photos";
import {debounce} from "../../../helpers/utils";
import React from "react";

export default function PhotosSearch() {
	const {filters} = usePhotos();
	const [inputValue, setInputValue] = React.useState(filters.q || "");

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetQ = React.useCallback(
		debounce((value: string) => filters.setQ(value), 200),
		[filters.setQ]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		debouncedSetQ(value);
	};

	return (
		<>
			<InputText
				icon={SearchIcon}
				placeholder="Buscar fotos"
				className="flex-1"
				value={inputValue}
				onChange={handleInputChange}
			/>
			<Divider orientation="vertical" className="h-10" />
		</>
	);
}
