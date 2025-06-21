import {type Photo} from "../models/photo";
import PhotoWidget from "./photo-widget";
import Text from "../components/text";

interface PhotosListProps {
	photos: Photo[];
}

export default function PhotosList({photos}: PhotosListProps) {
	return (
		<div className="space-y-6">
			<Text
				as="div"
				variant="paragraph-large"
				className="text-accent-span text-right"
			>
				Total: {photos.length}
			</Text>
			<div className="grid grid-cols-5 gap-9">
				{photos.map((photo) => (
					<PhotoWidget key={photo.id} photo={photo} />
				))}
			</div>
		</div>
	);
}
