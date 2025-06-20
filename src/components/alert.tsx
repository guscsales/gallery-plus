import {tv, type VariantProps} from "tailwind-variants";
import Text from "./text";

export const alertVariants = tv({
	base: `
    rounded-md py-3 px-5
  `,
	variants: {
		variant: {
			info: "bg-accent-brand/10",
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

export interface AlertProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof alertVariants> {}

export default function Alert({
	variant,
	children,
	className,
	...props
}: AlertProps) {
	return (
		<div
			role="alert"
			className={alertVariants({variant, className})}
			{...props}
		>
			<Text>{children}</Text>
		</div>
	);
}
