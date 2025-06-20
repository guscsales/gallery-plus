import {type VariantProps, tv} from "tailwind-variants";
import React from "react";

export const cardVariants = tv({
	base: `
		rounded border border-solid border-border-primary transition
	`,
	variants: {
		size: {
			none: "",
			md: "p-3",
		},
	},
	defaultVariants: {
		size: "none",
	},
});

interface CardProps
	extends VariantProps<typeof cardVariants>,
		React.ComponentProps<"div"> {
	as?: keyof React.JSX.IntrinsicElements;
}

export default function Card({
	as = "div",
	size,
	children,
	className,
	...props
}: CardProps) {
	return React.createElement(
		as,
		{
			className: cardVariants({size, className}),
			...props,
		},
		children
	);
}
