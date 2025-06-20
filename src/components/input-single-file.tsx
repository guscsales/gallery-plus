import * as React from "react";
import {tv, type VariantProps} from "tailwind-variants";
import {useWatch} from "react-hook-form";
import Icon from "./icon";
import Text from "./text";
import Card from "./card";
import FileImageIcon from "../assets/icons/image.svg?react";
import UploadFileIcon from "../assets/icons/upload-file.svg?react";

const inputSingleFileVariants = tv({
	base: `
    flex flex-col items-center justify-center w-full
    group-hover:border-border-active
    transition-default py-6 px-5
  `,
});

export interface InputSingleFileProps
	extends Omit<React.ComponentProps<"input">, "type">,
		VariantProps<typeof inputSingleFileVariants> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	form: any;
	allowedExtensions: string[];
	maxFileSizeInMB: number;
	replaceBy: React.ReactNode;
}

export default function InputSingleFile({
	className,
	form,
	allowedExtensions,
	maxFileSizeInMB,
	replaceBy,
	...props
}: InputSingleFileProps) {
	const formValues = useWatch({control: form.control});
	const name = props.name || "";
	const formFile: File = React.useMemo(
		() => formValues[name]?.[0],
		[formValues, name]
	);
	const {fileExtension, fileSize} = React.useMemo(() => {
		const extension = formFile?.name.split(".").pop()?.toLowerCase() || "";
		const size = formFile?.size || 0;

		return {fileExtension: extension, fileSize: size};
	}, [formFile]);

	return (
		<div className={className}>
			{formFile ? (
				<>
					<div className="mb-5">{replaceBy}</div>
					<div className="flex flex-col gap-2">
						<Card size="md" className="flex items-center gap-3">
							<Icon svg={FileImageIcon} className="fill-white w-6 h-6" />
							<div className="flex flex-col">
								<div className="truncate max-w-80">
									<Text variant="label-medium" className="text-placeholder">
										{formFile.name}
									</Text>
								</div>
								<div className="flex gap-1">
									<Text
										as="button"
										variant="label-small"
										className="text-accent-red cursor-pointer hover:underline"
										onClick={() => {
											form.setValue(name, undefined);
										}}
									>
										Remover
									</Text>
								</div>
							</div>
						</Card>
					</div>
				</>
			) : (
				<>
					<div className="w-full relative group cursor-pointer">
						<input
							id={props.name}
							type="file"
							className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
							{...props}
						/>
						<Card className={inputSingleFileVariants()}>
							<div className="flex flex-col items-center justify-center text-center gap-1">
								<Icon
									svg={UploadFileIcon}
									className="w-8 h-8 fill-placeholder"
								/>
								<Text variant="label-medium" className="text-placeholder">
									Arraste o arquivo aqui
									<br />
									ou clique para selecionar
								</Text>
							</div>
						</Card>
					</div>
					{fileExtension &&
						allowedExtensions &&
						!allowedExtensions.includes(fileExtension) && (
							<Text variant="label-small" className="text-accent-red">
								Tipo de arquivo inválido
							</Text>
						)}
					{maxFileSizeInMB && fileSize > maxFileSizeInMB * 1024 * 1024 && (
						<Text variant="label-small" className="text-accent-red">
							O arquivo é maior que o tamanho máximo
						</Text>
					)}
				</>
			)}
		</div>
	);
}
