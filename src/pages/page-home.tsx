import Container from "../components/container";
import PhotosList from "../core-components/photos-list";
import Text from "../components/text";
import Button from "../components/button";
import usePhotos from "../hooks/use-photos";
import useAlbums from "../hooks/use-albums";

export default function PageHome() {
	const {albums, isLoadingAlbums} = useAlbums();
	const {photos, isLoadingPhotos} = usePhotos();

	return (
		<Container>
			<div className="flex items-center gap-3.5 mb-9">
				<Text variant="heading-small">Álbuns</Text>
				<div className="flex gap-3">
					<Button variant="primary" size="sm" className="cursor-pointer">
						Todos
					</Button>
					{isLoadingAlbums &&
						Array.from({length: 5}).map((_, index) => (
							<Button loading key={index} />
						))}
					{albums?.map((album) => (
						<Button
							variant="ghost"
							size="sm"
							className="cursor-pointer"
							key={album.id}
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
