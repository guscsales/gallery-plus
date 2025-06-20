import {tv, type VariantProps} from "tailwind-variants";
import React from "react";

export const skeletonVariants = tv({
	base: "animate-pulse bg-background-secondary pointer-events-none",
	variants: {
		rounded: {
			sm: "rounded-sm",
			lg: "rounded-lg",
			full: "rounded-full",
		},
	},
	defaultVariants: {
		rounded: "lg",
	},
});

interface SkeletonProps
	extends VariantProps<typeof skeletonVariants>,
		React.ComponentProps<"div"> {}

export default function Skeleton({
	rounded,
	className,
	...props
}: SkeletonProps) {
	return <div className={skeletonVariants({rounded, className})} {...props} />;
}
