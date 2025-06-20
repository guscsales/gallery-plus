import React from "react";
import Icon from "./icon";
import {tv, type VariantProps} from "tailwind-variants";
import SpinnerIcon from "../assets/icons/spinner.svg?react";

export const buttonIconVariants = tv({
	base: "inline-flex items-center justify-center cursor-pointer transition",
	variants: {
		variant: {
			primary: "bg-accent-brand hover:bg-accent-brand-light",
			secondary: "bg-background-secondary hover:bg-background-tertiary",
			ghost: "bg-transparent hover:bg-border-primary/20",
		},
		size: {
			md: "w-10 h-10 p-2 rounded",
		},
		disabled: {
			true: "opacity-50 pointer-events-none",
		},
		handling: {
			true: "pointer-events-none",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
		disabled: false,
		handling: false,
	},
});

export const buttonIconIconVariants = tv({
	variants: {
		variant: {
			primary: "fill-white",
			secondary: "fill-white",
			ghost: "fill-white",
		},
		size: {
			md: "w-6 h-6",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

interface ButtonIconProps
	extends VariantProps<typeof buttonIconVariants>,
		Omit<React.ComponentProps<"button">, "size" | "disabled"> {
	icon: React.ComponentProps<typeof Icon>["svg"];
	handling?: boolean;
}

export default function ButtonIcon({
	variant,
	size,
	disabled,
	className,
	icon,
	handling,
	...props
}: ButtonIconProps) {
	return (
		<button
			className={buttonIconVariants({
				variant,
				size,
				disabled,
				className,
				handling,
			})}
			{...props}
		>
			<Icon
				svg={handling ? SpinnerIcon : icon}
				animate={handling}
				className={buttonIconIconVariants({variant, size})}
			/>
		</button>
	);
}
