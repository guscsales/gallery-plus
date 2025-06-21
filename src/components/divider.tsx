import {tv, type VariantProps} from "tailwind-variants";

export const dividerVariants = tv({
	base: "w-full h-px ",
	variants: {
		variant: {
			default: "bg-border-primary",
		},
		orientation: {
			horizontal: "w-full h-px",
			vertical: "w-px h-full",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface DividerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof dividerVariants> {
	orientation?: "horizontal" | "vertical";
}

export default function Divider({
	className,
	orientation = "horizontal",
	...props
}: DividerProps) {
	return (
		<div className={dividerVariants({className, orientation})} {...props} />
	);
}
