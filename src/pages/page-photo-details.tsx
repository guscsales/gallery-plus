import ButtonIcon from "../components/button-icon";
import Container from "../components/container";
import Text from "../components/text";
import ArrowLeftIcon from "../assets/icons/chevron-left.svg?react";
import ArrowRightIcon from "../assets/icons/chevron-right.svg?react";
import Button from "../components/button";
import PhotoImage from "../core-components/photo-image";
import InputCheckbox from "../components/input-checkbox";
import Divider from "../components/divider";
import useAlbums from "../hooks/use-albums";
import Skeleton from "../components/skeleton";
import {useNavigate, useParams} from "react-router";
import usePhoto from "../hooks/use-photo";
import {AppRoutes} from "../App";

export default function PagePhotoDetails() {
	const {id} = useParams();
	const navigate = useNavigate();
	const {photo, isLoadingPhoto, nextPhotoId, previousPhotoId} = usePhoto(
		id || ""
	);
	const {albums, isLoadingAlbums} = useAlbums();

	if (!isLoadingPhoto && !photo) {
		return <div>Foto não encontrada</div>;
	}

	return (
		<Container>
			<header className="flex items-center justify-between gap-8 mb-8">
				{!isLoadingPhoto ? (
					<Text variant="heading-large">{photo?.title}</Text>
				) : (
					<Skeleton className="w-48 h-8" />
				)}
				<div className="flex gap-2">
					{!isLoadingPhoto ? (
						<>
							<ButtonIcon
								variant="secondary"
								icon={ArrowLeftIcon}
								onClick={() =>
									navigate(
										AppRoutes.PHOTO_DETAILS.replace(
											":id",
											previousPhotoId || ""
										)
									)
								}
								disabled={!previousPhotoId}
							/>
							<Button
								variant="secondary"
								icon={ArrowRightIcon}
								onClick={() =>
									navigate(
										AppRoutes.PHOTO_DETAILS.replace(":id", nextPhotoId || "")
									)
								}
								disabled={!nextPhotoId}
							>
								Próxima imagem
							</Button>
						</>
					) : (
						<>
							<Skeleton className="w-10 h-10" />
							<Skeleton className="w-20 h-10" />
						</>
					)}
				</div>
			</header>

			<div className="grid grid-cols-[23.4375rem_1fr] gap-24">
				<div className="flex flex-col gap-3">
					{!isLoadingPhoto ? (
						<PhotoImage
							imageId={`${import.meta.env.VITE_IMAGES_URL}/${photo?.imageId}`}
							title={photo?.title}
							imageClassName="h-[23.4375rem]"
						/>
					) : (
						<Skeleton className="h-[23.4375rem]" />
					)}
					<div>
						{!isLoadingPhoto ? (
							<Button variant="destructive">Excluir</Button>
						) : (
							<Skeleton className="w-20 h-10" />
						)}
					</div>
				</div>

				<div className="py-3">
					<Text as="div" variant="heading-medium" className="mb-7">
						Álbuns
					</Text>

					<ul className="flex flex-col gap-4">
						{isLoadingAlbums &&
							Array.from({length: 5}).map((_, index) => (
								<li key={index}>
									<Skeleton className="h-[2.5rem]" />
								</li>
							))}
						{!isLoadingAlbums &&
							albums?.map((album, index) => (
								<li key={album.id}>
									<div className="flex items-center justify-between">
										<Text variant="paragraph-large">{album.title}</Text>
										<InputCheckbox />
									</div>
									{index !== albums.length - 1 && <Divider className="mt-4" />}
								</li>
							))}
					</ul>
				</div>
			</div>
		</Container>
	);
}
