import React from "react";
import {type VariantProps, tv} from "tailwind-variants";
import Icon from "./icon";
import CheckIcon from "../assets/icons/check.svg?react";

export const inputCheckboxWrapperVariants = tv({
	base: `
    inline-flex items-center justify-center relative
    group
  `,
});

export const inputCheckboxVariants = tv({
	base: `
      appearance-none peer flex items-center justify-center cursor-pointer
      transition overflow-hidden
    `,
	variants: {
		variant: {
			default: `
          border-2 border-solid
          border-border-primary hover:border-border-active
          checked:border-accent-brand checked:bg-accent-brand
          group-hover:checked:border-accent-brand group-hover:checked:bg-accent-brand
        `,
		},
		size: {
			md: "w-5 h-5 rounded-sm",
		},
		disabled: {
			true: "pointer-events-none",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
		disabled: false,
	},
});

export const inputCheckboxIconVariants = tv({
	base: `
      absolute top-1/2 -translate-y-1/2
      hidden peer-checked:block fill-white
      cursor-pointer
    `,
	variants: {
		size: {
			md: "w-4 h-4 left-0.5",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface InputCheckboxProps
	extends VariantProps<typeof inputCheckboxVariants>,
		Omit<React.ComponentProps<"input">, "size" | "disabled"> {}

export default function InputCheckbox({
	variant,
	size,
	disabled,
	className,
	...props
}: InputCheckboxProps) {
	return (
		<label className={inputCheckboxWrapperVariants({className})}>
			<input
				type="checkbox"
				className={inputCheckboxVariants({variant, size, disabled})}
				{...props}
			/>
			<Icon className={inputCheckboxIconVariants({size})} svg={CheckIcon} />
		</label>
	);
}
