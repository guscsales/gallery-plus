import Container from "../components/container";
import PhotosList from "../contexts/photos/components/photos-list";
import Text from "../components/text";
import Button from "../components/button";
import usePhotos from "../contexts/photos/hooks/use-photos";
import useAlbums from "../contexts/albums/hooks/use-albums";

export default function PageHome() {
	const {albums, isLoadingAlbums} = useAlbums();
	const {photos, isLoadingPhotos, filters} = usePhotos();

	return (
		<Container>
			<div className="flex items-center gap-3.5 mb-9 overflow-x-auto scrollbar-thin">
				<Text variant="heading-small">Álbuns</Text>
				<div className="flex gap-3">
					<Button
						variant={filters.albumId === null ? "primary" : "ghost"}
						size="sm"
						className="cursor-pointer"
						onClick={() => filters.setAlbumId(null)}
					>
						Todos
					</Button>
					{isLoadingAlbums &&
						Array.from({length: 5}).map((_, index) => (
							<Button loading key={index} />
						))}
					{albums?.map((album) => (
						<Button
							variant={filters.albumId === album.id ? "primary" : "ghost"}
							size="sm"
							className="cursor-pointer"
							key={album.id}
							onClick={() => filters.setAlbumId(album.id)}
						>
							{album.title}
						</Button>
					))}
				</div>
			</div>

			<PhotosList photos={photos} loading={isLoadingPhotos} />
		</Container>
	);
}
