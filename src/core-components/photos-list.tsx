import {type Photo} from "../models/photo";
import PhotoWidget from "./photo-widget";

interface PhotosListProps {
	photos: Photo[];
}

export default function PhotosList({photos}: PhotosListProps) {
	return (
		<div className="grid grid-cols-5 gap-9">
			{photos.map((photo) => (
				<PhotoWidget key={photo.id} photo={photo} />
			))}
		</div>
	);
}
