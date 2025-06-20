import React from "react";
import {tv, type VariantProps} from "tailwind-variants";

export const iconVariants = tv({
	variants: {
		animate: {
			false: "",
			true: "animate-spin",
		},
	},
	defaultVariants: {
		animate: false,
	},
});

interface IconProps
	extends React.ComponentProps<"svg">,
		VariantProps<typeof iconVariants> {
	svg: React.FC<React.ComponentProps<"svg">>;
}

export default function Icon({
	svg: SvgComponent,
	animate,
	className,
	...props
}: IconProps) {
	return (
		<SvgComponent className={iconVariants({animate, className})} {...props} />
	);
}
