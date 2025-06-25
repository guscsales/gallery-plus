import {type Photo} from "../models/photo";
import Text from "../../../components/text";
import Badge from "../../../components/badge";
import {Link} from "react-router";
import {AppRoutes} from "../../../App";
import {buttonTextVariants, buttonVariants} from "../../../components/button";
import PhotoImage from "./photo-image";
import Skeleton from "../../../components/skeleton";

interface PhotoWidgetProps {
	photo: Photo;
	loading?: boolean;
}

export default function PhotoWidget({photo, loading}: PhotoWidgetProps) {
	return (
		<div className="flex flex-col gap-4">
			{!loading ? (
				<PhotoImage
					imageId={`${import.meta.env.VITE_IMAGES_URL}/${photo.imageId}`}
					title={photo.title}
					imageClassName="w-[10.875rem] h-[10.875rem]"
				/>
			) : (
				<Skeleton className="w-[10.875rem] h-[10.875rem] rounded-lg" />
			)}
			<div className="flex flex-col gap-2">
				{!loading ? (
					<Text variant="paragraph-large" className="truncate">{photo.title}</Text>
				) : (
					<Skeleton className="w-full h-6" />
				)}
				<div className="flex gap-1 min-h-[1.375rem]">
					{!loading ? (
						<>
							{photo.albums.slice(0, 1).map((album) => (
								<Badge className="truncate" size="xs" key={album.id}>
									{album.title}
								</Badge>
							))}
							{photo.albums.length > 1 && (
								<Badge size="xs">+{photo.albums.length - 1}</Badge>
							)}
						</>
					) : (
						Array.from({length: 3}).map((_, index) => (
							<Skeleton key={index} className="w-full h-4 rounded-sm" />
						))
					)}
				</div>
			</div>
			{!loading ? (
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
			) : (
				<Skeleton className="w-full h-10" />
			)}
		</div>
	);
}
