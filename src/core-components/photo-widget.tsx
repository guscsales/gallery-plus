import {type Photo} from "../models/photo";
import Text from "../components/text";
import Badge from "../components/badge";
import {Link} from "react-router";
import {AppRoutes} from "../App";
import {buttonTextVariants, buttonVariants} from "../components/button";
import PhotoImage from "./photo-image";

interface PhotoWidgetProps {
	photo: Photo;
}

export default function PhotoWidget({photo}: PhotoWidgetProps) {
	return (
		<div className="flex flex-col gap-4">
			<PhotoImage
				imageId={photo.imageId}
				title={photo.title}
				imageClassName="h-44"
			/>
			<div className="flex flex-col gap-2">
				<Text variant="paragraph-large">{photo.title}</Text>
				<div className="flex gap-1 min-h-[1.375rem]">
					{photo.albums.slice(0, 1).map((album) => (
						<Badge size="xs" key={album.id}>
							{album.title}
						</Badge>
					))}
					{photo.albums.length > 1 && (
						<Badge size="xs">+{photo.albums.length - 1}</Badge>
					)}
				</div>
			</div>
			<Link
				to={AppRoutes.PHOTO_DETAILS.replace(":id", photo.id)}
				className={buttonVariants({
					variant: "secondary",
					className: "px-2 py-2",
				})}
			>
				<Text
					className={buttonTextVariants({variant: "secondary", size: "sm"})}
				>
					Detalhes da imagem
				</Text>
			</Link>
		</div>
	);
}
