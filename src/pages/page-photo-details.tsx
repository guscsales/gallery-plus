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

export default function PagePhotoDetails() {
	const {albums, isLoading} = useAlbums();

	return (
		<Container>
			<header className="flex items-center justify-between gap-8 mb-8">
				<Text variant="heading-large">Super Árvore</Text>
				<div className="flex gap-2">
					<ButtonIcon variant="secondary" icon={ArrowLeftIcon} />
					<Button variant="secondary" icon={ArrowRightIcon}>
						Próxima imagem
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-[23.4375rem_1fr] gap-24">
				<div className="flex flex-col gap-3">
					<PhotoImage
						imageId="/images/wide-tree.png"
						title="Super Árvore"
						imageClassName="h-[23.4375rem]"
					/>
					<div>
						<Button variant="destructive">Excluir</Button>
					</div>
				</div>

				<div className="py-3">
					<Text as="div" variant="heading-medium" className="mb-7">
						Álbuns
					</Text>

					<ul className="flex flex-col gap-4">
						{isLoading &&
							Array.from({length: 5}).map((_, index) => (
								<li key={index}>
									<Skeleton className="h-[2.5rem]" />
								</li>
							))}
						{albums?.map((album, index) => (
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
