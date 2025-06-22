import {useForm} from "react-hook-form";
import Button from "../components/button";
import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "../components/dialog";
import InputText from "../components/input-text";
import Text from "../components/text";
import PhotoImage from "./photo-image";
import SelectCheckboxIllustration from "../assets/images/select-checkbox.svg?react";

interface PhotoNewDialogProps {
	trigger: React.ReactNode;
}

export default function PhotoNewDialog({trigger}: PhotoNewDialogProps) {
	const form = useForm();

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>Criar álbum</DialogHeader>
				<DialogBody>
					<form className="flex flex-col gap-5">
						<InputText
							placeholder="Adicione um título"
							{...form.register("title")}
						/>

						<div className="flex flex-col gap-3">
							<Text variant="label-small">Fotos cadastradas</Text>
							<div className="flex flex-wrap gap-3">
								<PhotoImage
									imageId="/images/wide-tree.png"
									title="Foto 1"
									className="w-[5.25rem] rounded"
									imageClassName="h-[5.25rem]"
									selectable
									onSelect={(selected) => {
										console.log("selected", selected);
									}}
								/>
								<PhotoImage
									imageId="/images/wide-tree.png"
									title="Foto 1"
									className="w-[5.25rem] rounded"
									imageClassName="h-[5.25rem]"
									selectable
									onSelect={(selected) => {
										console.log("selected", selected);
									}}
								/>
								<div className="w-full flex flex-col justify-center items-center gap-3">
									<SelectCheckboxIllustration />
									<Text variant="paragraph-medium" className="text-center">
										Nenhuma foto disponível para seleção
									</Text>
								</div>
							</div>
						</div>
					</form>
				</DialogBody>
				<DialogFooter>
					<DialogClose>
						<Button variant="secondary">Cancelar</Button>
					</DialogClose>
					<Button>Criar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
