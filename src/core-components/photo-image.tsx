import cx from "classnames";

interface PhotoImageProps extends React.ComponentProps<"img"> {
	imageId: string;
	title: string;
	imageClassName?: string;
}

export default function PhotoImage({
	imageId,
	title,
	imageClassName,
	className,
	...props
}: PhotoImageProps) {
	return (
		<div className={cx("rounded-lg overflow-hidden", className)} {...props}>
			<img
				src={imageId}
				alt={title}
				className={cx("w-full object-cover", imageClassName)}
			/>
		</div>
	);
}
