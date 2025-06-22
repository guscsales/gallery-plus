import {tv} from "tailwind-variants";
import InputCheckbox from "../components/input-checkbox";
import React from "react";

export const photoImageVariants = tv({
	base: "rounded-lg overflow-hidden",
	variants: {
		selectable: {
			true: "cursor-pointer relative",
		},
		selected: {
			true: "outline-2 outline-accent-brand",
		},
	},
});

export const photoImageImageVariants = tv({
	base: "w-full object-cover",
});

interface PhotoImageProps
	extends Omit<React.ComponentProps<"div">, "onSelect"> {
	imageId: string;
	title: string;
	imageClassName?: string;
	selectable?: boolean;
	selected?: boolean;
	onSelect?: (selected: boolean) => void;
}

export default function PhotoImage({
	imageId,
	title,
	imageClassName,
	className,
	selectable,
	selected,
	onSelect,
	...props
}: PhotoImageProps) {
	const [isSelected, setIsSelected] = React.useState(selected);

	function handleSelect() {
		const newValue = !isSelected;
		setIsSelected(newValue);
		onSelect?.(newValue);
	}

	return (
		<div
			className={photoImageVariants({
				className,
				selectable,
				selected: isSelected,
			})}
			onClick={selectable ? handleSelect : undefined}
			{...props}
		>
			{selectable && (
				<InputCheckbox
					size="sm"
					checked={isSelected}
					className="absolute top-1 left-1"
				/>
			)}
			<img
				src={imageId}
				alt={title}
				className={photoImageImageVariants({className: imageClassName})}
			/>
		</div>
	);
}
