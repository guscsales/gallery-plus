import Divider from "../../../components/divider";
import InputCheckbox from "../../../components/input-checkbox";
import Skeleton from "../../../components/skeleton";
import Text from "../../../components/text";
import usePhotoAlbums from "../../photos/hooks/use-photo-albums";
import type {Photo} from "../../photos/models/photo";
import type {Album} from "../models/album";

interface AlbumsListProps {
	loading: boolean;
	albums: Album[];
	photo: Photo;
}

export default function AlbumsListSelectable({
	loading,
	albums,
	photo,
}: AlbumsListProps) {
	const {managePhotoOnAlbums} = usePhotoAlbums();

	function isChecked(albumId: string) {
		return photo?.albums?.some((a) => a.id === albumId);
	}

	async function handlePhotoOnAlbums(albumId: string) {
		let albumsIds = [];

		if (isChecked(albumId)) {
			albumsIds = photo.albums.filter((a) => a.id !== albumId).map((a) => a.id);
		} else {
			albumsIds = [...photo.albums.map((a) => a.id), albumId];
		}

		await managePhotoOnAlbums(photo.id, albumsIds);
	}

	return (
		<ul className="flex flex-col gap-4">
			{loading &&
				Array.from({length: 5}).map((_, index) => (
					<li key={index}>
						<Skeleton className="h-[2.5rem]" />
					</li>
				))}
			{!loading &&
				albums?.map((album, index) => (
					<li key={album.id}>
						<div className="flex items-center justify-between">
							<Text variant="paragraph-large">{album.title}</Text>
							<InputCheckbox
								checked={isChecked(album.id)}
								onClick={() => handlePhotoOnAlbums(album.id)}
							/>
						</div>
						{index !== albums.length - 1 && <Divider className="mt-4" />}
					</li>
				))}
		</ul>
	);
}
