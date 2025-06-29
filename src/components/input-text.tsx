import {type VariantProps, tv} from "tailwind-variants";
import cx from "classnames";
import React from "react";
import {textVariants} from "./text";
import Icon from "./icon";
import SpinnerIcon from "../assets/icons/spinner.svg?react";
import Text from "./text";

export const inputTextContainerVariants = tv({
	base: "flex flex-col gap-1",
});

export const inputTextWrapperVariants = tv({
	base: `
		border border-solid border-border-primary focus:border-border-active bg-transparent 
		rounded flex items-center gap-3
	`,
	variants: {
		size: {
			md: "h-10 p-3",
		},
		disabled: {
			true: "pointer-events-none",
		},
	},
	defaultVariants: {
		size: "md",
		disabled: false,
	},
});

export const inputTextVariants = tv({
	base: `
		bg-transparent outline-none placeholder:text-placeholder text-accent-paragraph
		flex-1
	`,
});

export const inputTextIconVariants = tv({
	base: "fill-placeholder",
	variants: {
		size: {
			md: "w-6 h-6",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface InputTextProps
	extends VariantProps<typeof inputTextWrapperVariants>,
		Omit<React.ComponentProps<"input">, "size" | "disabled"> {
	icon?: React.ComponentProps<typeof Icon>["svg"];
	handling?: boolean;
	error?: React.ReactNode;
}

export default function InputText({
	size,
	disabled,
	className,
	icon,
	handling,
	error,
	...props
}: InputTextProps) {
	return (
		<div className={inputTextContainerVariants({className})}>
			<div className={inputTextWrapperVariants({size, disabled})}>
				{(icon || handling) && (
					<Icon
						svg={handling ? SpinnerIcon : icon!}
						animate={handling}
						className={inputTextIconVariants({size})}
					/>
				)}
				<input
					className={cx(inputTextVariants(), textVariants())}
					disabled={disabled as boolean}
					{...props}
				/>
			</div>
			{error && (
				<Text variant="label-small" className="text-accent-red">
					{error}
				</Text>
			)}
		</div>
	);
}
