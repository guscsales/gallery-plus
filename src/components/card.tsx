import {type VariantProps, tv} from "tailwind-variants";
import React from "react";

export const cardVariants = tv({
	base: `
		rounded transition
	`,
	variants: {
		variant: {
			default: "border border-solid border-border-primary bg-transparent",
			primary: "bg-background-primary",
		},
		size: {
			none: "",
			md: "p-3",
			lg: "p-6",
		},
	},
	defaultVariants: {
		size: "none",
		variant: "default",
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
	variant,
	children,
	className,
	...props
}: CardProps) {
	return React.createElement(
		as,
		{
			className: cardVariants({size, variant, className}),
			...props,
		},
		children
	);
}
