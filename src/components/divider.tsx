import {tv, type VariantProps} from "tailwind-variants";

export const dividerVariants = tv({
	base: "w-full h-px ",
	variants: {
		variant: {
			default: "bg-border-primary",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

interface DividerProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof dividerVariants> {}

export default function Divider({className, ...props}: DividerProps) {
	return <div className={dividerVariants({className})} {...props} />;
}
